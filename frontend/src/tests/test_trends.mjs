#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node tools/test_trends.mjs <historical_json_file> [home_identifier]');
        process.exit(2);
    }

    const dataFile = args[0];
    const homeIdOrAddress = args[1];

    const root = process.cwd();
    const trendsPath = path.resolve(root, 'frontend', 'src', 'utils', 'trends.js');
    const trendsUrl = pathToFileURL(trendsPath).href;

    const trends = await import(trendsUrl);

    let raw;
    try {
        raw = fs.readFileSync(path.resolve(dataFile), 'utf8');
    } catch (err) {
        console.error('Cannot read data file:', dataFile, err.message);
        process.exit(3);
    }

    let historicalData;
    try {
        historicalData = JSON.parse(raw);
    } catch (err) {
        console.error('Invalid JSON in', dataFile, err.message);
        process.exit(4);
    }

    if (!Array.isArray(historicalData)) {
        const cand = Object.values(historicalData).find(v => Array.isArray(v));
        if (Array.isArray(cand)) historicalData = cand;
        else {
            console.error('Provided JSON does not contain an array of year objects.');
            process.exit(5);
        }
    }

    let home = null;
    if (homeIdOrAddress) {
        const latest = historicalData[historicalData.length - 1];
        if (latest && Array.isArray(latest.households)) {
            home = latest.households.find(hh => {
                if (!hh) return false;
                if (String(hh.id) === String(homeIdOrAddress)) return true;
                if (hh.address && String(hh.address).toLowerCase().includes(String(homeIdOrAddress).toLowerCase())) return true;
                if (hh.residents && hh.residents.some(r => String(r.unique_id) === String(homeIdOrAddress))) return true;
                return false;
            });
        }
    }

    if (!home) {
        const latest = historicalData[historicalData.length - 1];
        if (latest && Array.isArray(latest.households) && latest.households.length > 0) {
            home = latest.households[0];
            console.log(home.address || home.id);
        } else {
            console.error('No households found in the provided historical data.');
            process.exit(6);
        }
    }

    const trendsResult = trends.getHomeTrends(historicalData, home, 2024);
    if (!trendsResult) {
        console.log('No trends returned for the selected home.');
        process.exit(0);
    }

    console.log('\nHome used for test:', home.address || home.id);
    console.log('\nYears:', trendsResult.years.join(', '));
    console.log('\nKPI (raw):', trendsResult.kpi_level.map(v => (v === null || v === undefined) ? 'null' : String(v)).join(', '));
    const mapped = (trendsResult.kpi_level || []).map(l => {
        if (l === null || l === undefined) return null;
        const n = trends.KPI_RANK[String(l).trim().toLowerCase()];
        if (n) return n;
        const num = Number(l);
        return Number.isFinite(num) ? num : null;
    });
    console.log('\nKPI (mapped numeric):', mapped.map(v => v === null ? 'null' : v).join(', '));
    console.log('\nAvg incomes:', (trendsResult.avg_income || []).map(v => v === null ? 'null' : Number(v).toFixed(2)).join(', '));

    console.log('\nPer-year detail:');
    for (let i = 0; i < trendsResult.years.length; i++) {
        console.log(`${trendsResult.years[i]} \t KPI:${trendsResult.kpi_level[i] ?? 'null'} \t mapped:${mapped[i] ?? 'null'} \t income:${trendsResult.avg_income[i] ?? 'null'}`);
    }
}

main().catch(err => {
    console.error('Fatal error running test script:', err);
    process.exit(10);
});
