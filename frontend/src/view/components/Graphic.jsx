/**
 * Component to display a simulation graph based on the provided data.
 *
 * Props:
 * @param {string} title - The title of the graph. Defaults to "Simulation Graph".
 * @param {string} yAxisKey - The key for the Y-axis data. Defaults to "solar_panel_price".
 * Valid keys include:
 * - "decisions_this_year"
 * - "environmental_influence"
 * - "households_with_panels"
 * - "residents_for_panels"
 * - "solar_panel_price"
 *
 * State:
 * @property {Array} simulationData - The data fetched for the simulation graph.
 * @property {boolean} loading - Indicates whether the data is still being loaded.
 *
 * Returns:
 * A React component that renders a line chart with the simulation data.
 */

import React, { useState, useEffect } from "react";
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
import configFormController from "../../controller/ConfigFormController.js";
import "../styles/Graphic.css";

const validKeys = [
    "decisions_this_year",
    "environmental_influence",
    "households_with_panels",
    "residents_for_panels",
    "solar_panel_price"
];

const Graphic = ({ title = "Simulation Graph", yAxisKey = "solar_panel_price" }) => {
    const [simulationData, setSimulationData] = useState([]);
    const [loading, setLoading] = useState(true);

    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];

    /**
     * Fetches the simulation data from the controller.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await configFormController.getOverview();
                setSimulationData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching simulation data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const flattenedData = simulationData.flatMap(d => [
        { year: d.year, state: "Start", value: d.start_state[yKey] },
        { year: d.year, state: "End", value: d.end_state[yKey] }
    ]);

    const yValues = flattenedData.map(d => d.value);
    const yMinRaw = Math.min(...yValues);
    const yMaxRaw = Math.max(...yValues);

    const yMin = yKey === "environmental_influence"
        ? Math.floor(yMinRaw * 10) / 10
        : Math.floor(yMinRaw);

    const yMax = yKey === "environmental_influence"
        ? Math.ceil(yMaxRaw * 10) / 10
        : Math.ceil(yMaxRaw);

    return (
        <div className="map-preview-container">
            <h2 className={"graphic-title"}>{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={flattenedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} tickCount={simulationData.length} />
                    <YAxis
                        domain={[yMin, yMax]}
                        tickFormatter={value => (yKey === "environmental_influence" ? value.toFixed(2) : Math.round(value))}
                        allowDecimals={yKey === "environmental_influence"}
                    />
                    <Tooltip formatter={(value) => (yKey === "environmental_influence" ? value.toFixed(2) : value)} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        data={flattenedData.filter(d => d.state === "Start")}
                        name="Start of the year"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        data={flattenedData.filter(d => d.state === "End")}
                        name="End of the year"
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