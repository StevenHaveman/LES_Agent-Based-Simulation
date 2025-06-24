/**
 * Graphic Component
 *
 * This React component displays a simulation graph based on the provided data.
 * It uses the `recharts` library to render a responsive line chart with data points
 * representing the start and end states of a simulation year.
 *
 * Props:
 * - `title` (string): The title of the graph. Defaults to an empty string.
 * - `yAxisKey` (string): The key for the Y-axis data. Valid keys include:
 *   - "solar_panel_price"
 *   - "heat_pump_price"
 *   - "solar_panel_households"
 *   - "solar_panel_positive_decisions"
 *   If an invalid key is provided, the first valid key is used as a fallback.
 *
 * State:
 * - `simulationData` (Array): The fetched simulation data used to populate the graph.
 * - `loading` (boolean): Indicates whether the data is still being fetched.
 *
 * Effects:
 * - Fetches simulation data and polling delay on component mount.
 * - Sets up an interval to periodically fetch simulation data based on the polling delay.
 * - Cleans up the interval on component unmount.
 *
 * Methods:
 * - `fetchData()`: Fetches simulation data from the backend.
 * - `fetchInterval()`: Fetches the polling delay and sets up periodic data fetching.
 *
 * Returns:
 * - A responsive line chart displaying the simulation data for the selected Y-axis key.
 * - A loading message if the data is still being fetched.
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

import "../styles/Graphic.css";
import overviewController from "../../controller/OverviewController.js";
import simulationRunController from "../../controller/SimulationRunController.js";

const validKeys = [
    "solar_panel_price",
    "heat_pump_price",
    "solar_panel_households",
    "solar_panel_positive_decisions"
];

const Graphic = ({ title = "", yAxisKey = "" }) => {
    const [simulationData, setSimulationData] = useState([]);
    const [loading, setLoading] = useState(true);

    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];

    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            try {
                const result = await overviewController.getSimulationGraphicResults();
                setSimulationData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching simulation data", error);
                setLoading(false);
            }
        };

        const fetchInterval = async () => {
            const res = await simulationRunController.getSimulationDelay()
            const delay = parseInt(res.delay || 3) * 1000;

            await fetchData(); // Initial fetch

            intervalId = setInterval(fetchData, delay);
        };

        fetchInterval();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const flattenedData = simulationData.flatMap(d => {
        const entries = [];
        const { year, start_state_per_package, end_state_per_package } = d;

        const extract = (key, stateObj, stateLabel) => {
            let value = null;
            switch (key) {
                case "solar_panel_price":
                    value = stateObj?.["Solar Panel"]?.price;
                    break;
                case "heat_pump_price":
                    value = stateObj?.["Heat Pump"]?.price;
                    break;
                case "solar_panel_households":
                    value = stateObj?.["Solar Panel"]?.households_with_package;
                    break;
                case "solar_panel_positive_decisions":
                    value = stateObj?.["Solar Panel"]?.residents_positive_decision;
                    break;
            }

            if (value !== undefined && value !== null) {
                entries.push({ year, state: stateLabel, value });
            }
        };

        extract(yKey, start_state_per_package, "Start");
        extract(yKey, end_state_per_package, "End");

        return entries;
    });

    const yValues = flattenedData.map(d => d.value);
    const yMin = Math.floor(Math.min(...yValues));
    const yMax = Math.ceil(Math.max(...yValues));

    return (
        <div className="graphic-container">
            <h3 className="graphic-title">{title}</h3>
            <div className="graphic-square-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={flattenedData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="year"
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickCount={simulationData.length}
                        />
                        <YAxis
                            domain={[yMin, yMax]}
                            allowDecimals={true}
                            tickFormatter={value => value.toFixed(0)}
                        />
                        <Tooltip formatter={value => value.toFixed(0)} />
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
        </div>
    );
};

export default Graphic;