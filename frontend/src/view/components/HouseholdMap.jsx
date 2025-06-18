import React, { useEffect, useRef, useState } from 'react';
import "../styles/HouseholdMap.css";
import detailController from "../../controller/DetailController.js";

/**
 * HouseholdMap component
 * Displays households as clickable icons on a canvas map with random positions.
 * Selecting an icon updates the selected household and residents.
 *
 * Props:
 * - onSelectResidents: function to pass selected residents to parent
 * - onSelectHousehold: function to pass selected household to parent
 * - selectedHouseholdId: ID of the currently selected household (used for highlighting)
 */
const HouseholdMap = ({ onSelectResidents, onSelectHousehold, selectedHouseholdId }) => {
    const [households, setHouseholds] = useState([]);
    const canvasRef = useRef(null);
    const householdPositions = useRef({});
    const iconRef = useRef(null);


    useEffect(() => {
        const fetchAndUpdateHouseholds = async () => {
            try {
                const data = await detailController.fetch_households();
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };

        fetchAndUpdateHouseholds(); // Alleen eenmalig ophalen bij laden component
    }, []);


    useEffect(() => {
        const icon = new Image();
        // icon.src = "/INNO/Household_img.webp";
        icon.src = "/INNO/Household_icon.png";
        icon.onload = () => {
            iconRef.current = icon;
            drawCanvas();
        };
    }, []);

    // Generate and store random positions for each household when data is loaded
    useEffect(() => {
        if (households.length > 0 && canvasRef.current) {
            const canvas = canvasRef.current;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            const newPositions = {};
            const maxAttempts = 100;

            const isOverlapping = (x, y, existingPositions) => {
                const size = 32;
                for (const pos of Object.values(existingPositions)) {
                    const dx = pos.x - x;
                    const dy = pos.y - y;
                    if (Math.abs(dx) < size && Math.abs(dy) < size) {
                        return true;
                    }
                }
                return false;
            };

            households.forEach(household => {
                let x, y, attempts = 0;
                do {
                    x = Math.random() * (width - 40);
                    y = Math.random() * (height - 40);
                    attempts++;
                } while (isOverlapping(x, y, newPositions) && attempts < maxAttempts);

                newPositions[household.id] = {
                    x,
                    y,
                    width: 32,
                    height: 32
                };
            });

            householdPositions.current = newPositions;

            if (iconRef.current) {
                drawCanvas();
            }
        }
    }, [households]);


    // Redraw canvas when selected household changes (to update highlighting)
    useEffect(() => {
        if (iconRef.current) {
            drawCanvas();
        }
    }, [selectedHouseholdId]);

    // Draw all households and highlight selected one
    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;


        ctx.fillStyle = "#b0f5a0"; // Light green background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw each household icon and highlight if selected
        households.forEach((household) => {
            const pos = householdPositions.current[household.id];
            if (!pos) return;

            // Draw household icon at assigned position
            ctx.drawImage(iconRef.current, pos.x, pos.y, 32, 32);

            // If selected, draw a circle around the icon
            if (household.id === selectedHouseholdId) {
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.arc(pos.x + 16, pos.y + 16, 20, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
    };

    // Handle clicks on the canvas to detect household selection
    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is within bounds of any household icon
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

    // Render the canvas element
    return (
        <canvas
            ref={canvasRef}
            className="household-canvas"
            onClick={handleCanvasClick}
        />
    );
};

export default HouseholdMap;