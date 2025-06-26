/**
 * HouseholdMap Component
 *
 * This React component renders a canvas that displays a map of households.
 * Each household is represented by an icon, and clicking on a household triggers
 * selection callbacks for residents and the household itself.
 *
 * Props:
 * - `onSelectResidents` (function): Callback function triggered when a household is selected.
 *   Receives the residents of the selected household as an argument.
 * - `onSelectHousehold` (function): Callback function triggered when a household is selected.
 *   Receives the selected household object as an argument.
 * - `selectedHouseholdId` (string | number): ID of the currently selected household.
 *
 * State:
 * - `households` (Array): List of household objects fetched from the backend.
 *
 * Refs:
 * - `canvasRef`: Reference to the canvas element used for rendering the map.
 * - `householdPositions`: Stores the positions of households on the canvas.
 * - `iconRef`: Reference to the household icon image used for rendering.
 *
 * Effects:
 * - Fetches household data once on component mount.
 * - Loads the household icon image and triggers canvas rendering.
 * - Updates household positions and redraws the canvas when household data changes.
 * - Redraws the canvas when the selected household changes.
 *
 * Methods:
 * - `drawCanvas()`: Draws the canvas with household icons and highlights the selected household.
 * - `handleCanvasClick(event)`: Handles click events on the canvas to detect and select a household.
 *
 * Returns:
 * - A canvas element that displays the household map.
 */

import React, { useEffect, useRef, useState } from 'react';
import "../styles/HouseholdMap.css";
import overviewController from "../../controller/OverviewController.js";

const HouseholdMap = ({ onSelectResidents, onSelectHousehold, selectedHouseholdId }) => {
    const [households, setHouseholds] = useState([]);
    const canvasRef = useRef(null);
    const householdPositions = useRef({});
    const iconRef = useRef(null);


    const fetchHouseholdsWithRetry = async (retries = 20, delay = 1000) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const data = await overviewController.fetch_households();
                setHouseholds(data);
                return;
            } catch (error) {
                if (attempt === retries - 1) {
                    console.error("Failed to fetch households after retries:", error);
                } else {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    };

    fetchHouseholdsWithRetry();

    useEffect(() => {
        const icon = new Image();
        icon.src = "Household_icon.png"; // Path to your household icon image
        icon.onload = () => {
            iconRef.current = icon;
            drawCanvas();
        };
    }, []);

    useEffect(() => {
        if (households.length > 0 && canvasRef.current) {
            const canvas = canvasRef.current;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            const newPositions = {};
            households.forEach(household => {
                const x = Math.random() * (width - 40);
                const y = Math.random() * (height - 40);
                newPositions[household.id] = { x, y, width: 32, height: 32 };
            });

            householdPositions.current = newPositions;

            if (iconRef.current) {
                drawCanvas();
            }
        }
    }, [households]);

    useEffect(() => {
        if (iconRef.current) {
            drawCanvas();
        }
    }, [selectedHouseholdId]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.fillStyle = "#b0f5a0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        households.forEach((household) => {
            const pos = householdPositions.current[household.id];
            if (!pos) return;

            ctx.drawImage(iconRef.current, pos.x, pos.y, 32, 32);

            if (household.id === selectedHouseholdId) {
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.arc(pos.x + 16, pos.y + 16, 20, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
    };

    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (const [id, pos] of Object.entries(householdPositions.current)) {
            if (
                x >= pos.x && x <= pos.x + pos.width &&
                y >= pos.y && y <= pos.y + pos.height
            ) {
                const selected = households.find(h => h.id.toString() === id);
                if (selected) {
                    onSelectResidents(selected.residents);
                    onSelectHousehold(selected);
                }
                break;
            }
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="household-canvas"
            onClick={handleCanvasClick}
        />
    );
};

export default HouseholdMap;
