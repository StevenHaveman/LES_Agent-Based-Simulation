/**
 * Component to display a simulation graph based on the provided data.
 *
 * Props:
 * @param {string} title - The title of the graph. Defaults to "Simulation Graph".
 * @param {string} yAxisKey - The key for the Y-axis data.
 * Valid keys include:
 * - "decisions_this_year_total"
 * - "solar_panel_households"
 * - "heat_pump_households"
 * - "solar_panel_price"
 * - "heat_pump_price"
 * - "solar_panel_positive_decisions"
 * - "heat_pump_positive_decisions"
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

import "../styles/Graphic.css";
import overviewController from "../../controller/OverviewController.js";

// Valid keys for graphing
const validKeys = [
    "decisions_this_year_total",
    "solar_panel_households",
    "heat_pump_households",
    "solar_panel_price",
    "heat_pump_price",
    "solar_panel_positive_decisions",
    "heat_pump_positive_decisions"
];

const Graphic = ({ title = "Simulation Graph", yAxisKey = "decisions_this_year_total" }) => {
    const [simulationData, setSimulationData] = useState([]);
    const [loading, setLoading] = useState(true);

    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await overviewController.getOverview();
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

    const flattenedData = simulationData.flatMap(d => {
        const entries = [];
        const { year, start_state_per_package, end_state_per_package } = d;

        const extract = (key, stateObj, stateLabel) => {
            let value;
            switch (key) {
                case "decisions_this_year_total":
                    value = stateLabel === "Start" ? d.decisions_this_year_total : d.decisions_this_year_total_end;
                    break;
                case "solar_panel_households":
                    value = stateObj?.["Solar Panel"]?.households_with_package;
                    break;
                case "heat_pump_households":
                    value = stateObj?.["Heat Pump"]?.households_with_package;
                    break;
                case "solar_panel_price":
                    value = stateObj?.["Solar Panel"]?.price;
                    break;
                case "heat_pump_price":
                    value = stateObj?.["Heat Pump"]?.price;
                    break;
                case "solar_panel_positive_decisions":
                    value = stateObj?.["Solar Panel"]?.residents_positive_decision;
                    break;
                case "heat_pump_positive_decisions":
                    value = stateObj?.["Heat Pump"]?.residents_positive_decision;
                    break;
                default:
                    value = null;
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
                            name="Start van het jaar"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            data={flattenedData.filter(d => d.state === "End")}
                            name="Einde van het jaar"
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