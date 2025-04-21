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

// Dummy data
const dummyData = [
    { decisions_this_year: 0, environmental_influence: 0.0, households_with_panels: 0, residents_for_panels: 0, solar_panel_price: 410, year: 0 },
    { decisions_this_year: 2, environmental_influence: 0.222, households_with_panels: 2, residents_for_panels: 2, solar_panel_price: 412, year: 1 },
    { decisions_this_year: 1, environmental_influence: 0.333, households_with_panels: 3, residents_for_panels: 3, solar_panel_price: 421, year: 2 },
    { decisions_this_year: 2, environmental_influence: 0.556, households_with_panels: 5, residents_for_panels: 5, solar_panel_price: 434, year: 3 },
    { decisions_this_year: 0, environmental_influence: 0.556, households_with_panels: 5, residents_for_panels: 5, solar_panel_price: 453, year: 4 },
    { decisions_this_year: 0, environmental_influence: 0.556, households_with_panels: 5, residents_for_panels: 5, solar_panel_price: 471, year: 5 },
    { decisions_this_year: 0, environmental_influence: 0.556, households_with_panels: 5, residents_for_panels: 5, solar_panel_price: 486, year: 6 },
    { decisions_this_year: 0, environmental_influence: 0.556, households_with_panels: 5, residents_for_panels: 5, solar_panel_price: 502, year: 7 },
    { decisions_this_year: 0, environmental_influence: 0.556, households_with_panels: 5, residents_for_panels: 5, solar_panel_price: 504, year: 8 },
    { decisions_this_year: 1, environmental_influence: 0.667, households_with_panels: 6, residents_for_panels: 6, solar_panel_price: 517, year: 9 }
];

const Graphic = ({ title = "Simulatiegrafiek", yAxisKey = "solar_panel_price" }) => {
    const validKeys = [
        "decisions_this_year",
        "environmental_influence",
        "households_with_panels",
        "residents_for_panels",
        "solar_panel_price"
    ];

    let yKey = validKeys.includes(yAxisKey) ? yAxisKey : "?";

    const yValues = dummyData.map(d => d[yKey]);
    const yMin = Math.min(...yValues) * 0.9;
    const yMax = Math.max(...yValues) * 1.1;

    return (
        <div className="map-preview-container">
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dummyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="year"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickCount={dummyData.length}
                        label={{ value: "Jaar", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis
                        domain={[yMin, yMax]}
                        tickFormatter={(value) =>
                            yKey === "environmental_influence" ? value.toFixed(2) : Math.round(value)
                        }
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={yKey}
                        stroke="#8884d8"
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