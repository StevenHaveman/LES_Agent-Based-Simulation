import React from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import "../styles/Graphic.css";


const dummyData = [
    {
        "decisions_this_year": 0,
        "end_state": {
            "decisions_this_year": 2,
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 429
        },
        "start_state": {
            "environmental_influence": 0.222,
            "households_with_panels": 2,
            "residents_for_panels": 2,
            "solar_panel_price": 410
        },
        "year": 0
    },
    {
        "decisions_this_year": 2,
        "end_state": {
            "decisions_this_year": 0,
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 436
        },
        "start_state": {
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 429
        },
        "year": 1
    },
    {
        "decisions_this_year": 0,
        "end_state": {
            "decisions_this_year": 0,
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 438
        },
        "start_state": {
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 436
        },
        "year": 2
    },
    {
        "decisions_this_year": 0,
        "end_state": {
            "decisions_this_year": 0,
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 442
        },
        "start_state": {
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 438
        },
        "year": 3
    },
    {
        "decisions_this_year": 0,
        "end_state": {
            "decisions_this_year": 0,
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 453
        },
        "start_state": {
            "environmental_influence": 0.444,
            "households_with_panels": 4,
            "residents_for_panels": 4,
            "solar_panel_price": 442
        },
        "year": 4
    }
];

const validKeys = [
    "decisions_this_year",
    "environmental_influence",
    "households_with_panels",
    "residents_for_panels",
    "solar_panel_price"
];

const Graphic = ({ title = "Simulatiegrafiek", yAxisKey = "solar_panel_price" }) => {
    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];

    const flattenedData = dummyData.flatMap(d => [
        { year: d.year, state: "Start", value: d.start_state[yKey] },
        { year: d.year, state: "End", value: d.end_state[yKey] }
    ]);

    const yValues = flattenedData.map(d => d.value);
    const yMin = Math.min(...yValues) * 0.9;
    const yMax = Math.max(...yValues) * 1.1;

    return (
        <div className="map-preview-container">
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{title} ({yKey.replace(/_/g, " ")})</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={flattenedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} tickCount={dummyData.length} />
                    <YAxis domain={[yMin, yMax]} tickFormatter={value => (yKey === "environmental_influence" ? value.toFixed(2) : Math.round(value))} />
                    <Tooltip formatter={(value) => (yKey === "environmental_influence" ? value.toFixed(3) : value)} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        data={flattenedData.filter(d => d.state === "Start")}
                        name="Start van jaar"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        data={flattenedData.filter(d => d.state === "End")}
                        name="Einde van jaar"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Graphic;