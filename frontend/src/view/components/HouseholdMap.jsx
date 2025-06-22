import React, {useEffect, useRef, useState} from 'react';
import "../styles/HouseholdMap.css";
import detailController from "../../controller/DetailController.js";

const HouseholdMap = ({onSelectResidents, onSelectHousehold, selectedHouseholdId}) => {
    const [households, setHouseholds] = useState([]);
    const [pollingDelay, setPollingDelay] = useState(3000); // Default fallback delay
    const canvasRef = useRef(null);
    const householdPositions = useRef({});
    const iconRef = useRef(null);

    // Fetch delay ONCE and store it
    useEffect(() => {
        const fetchDelayOnce = async () => {
            try {
                const delayRes = await detailController.getDelay();
                const delay = parseInt(delayRes.delay || "3", 10) * 1000;
                setPollingDelay(delay);
            } catch (error) {
                console.error("Failed to fetch delay for polling:", error);
            }
        };
        fetchDelayOnce();
    }, []);

    // Poll households using stored delay
    useEffect(() => {
        let intervalId;

        const fetchAndUpdateHouseholds = async () => {
            try {
                const data = await detailController.fetch_households();
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };

        fetchAndUpdateHouseholds();
        intervalId = setInterval(fetchAndUpdateHouseholds, pollingDelay);

        return () => clearInterval(intervalId);
    }, [pollingDelay]); // Only rerun if delay changes

    useEffect(() => {
        const icon = new Image();
        icon.src = "/INNO/Household_icon.png";
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

            const currentPositions = householdPositions.current;

            households.forEach(household => {
                // Alleen positie genereren als deze nog niet bestaat
                if (!currentPositions[household.id]) {
                    const x = Math.random() * (width - 40);
                    const y = Math.random() * (height - 40);
                    currentPositions[household.id] = {x, y, width: 32, height: 32};
                }
            });

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

        households.forEach(household => {
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