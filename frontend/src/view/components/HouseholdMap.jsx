import React, { useEffect, useRef, useState } from 'react';
import "../styles/HouseholdMap.css";
import detailController from "../../controller/DetailController.js";

const HouseholdMap = ({ onSelectResidents, onSelectHousehold, selectedHouseholdId }) => {
    const [households, setHouseholds] = useState([]);
    const canvasRef = useRef(null);
    const householdPositions = useRef({});
    const iconRef = useRef(null);

    // Fetch households
    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const data = await detailController.fetch_households();
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };
        fetchHouseholds();
    }, []);

    // Load icon image once
    useEffect(() => {
        const icon = new Image();
        icon.src = "/INNO/Household_icon.png";
        icon.onload = () => {
            iconRef.current = icon;
            drawCanvas();
        };
    }, []);

    // Generate household positions only once
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

    // Redraw when selection changes
    useEffect(() => {
        if (iconRef.current) {
            drawCanvas();
        }
    }, [selectedHouseholdId]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Resize canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.fillStyle = "#b0f5a0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw icons and selection
        households.forEach((household) => {
            const pos = householdPositions.current[household.id];
            if (!pos) return;

            // Draw icon
            ctx.drawImage(iconRef.current, pos.x, pos.y, 32, 32);

            // Highlight selected household
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
                    onSelectHousehold(selected); // Sync with list
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