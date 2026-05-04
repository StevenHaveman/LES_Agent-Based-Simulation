import React, { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';
import '../styles/overviewpage.css';
import '../styles/globalPageStyles.css';
import { OverviewProvider, useOverviewState } from '../state/overviewState.jsx';

import GraphicsView from '../components/GraphicsView.jsx';
import MapView from '../components/MapView.jsx';
import MapFilterMenu from '../components/MapFilterMenu.jsx';
import SidebarToggle from '../components/SidebarToggle.jsx';

import ResidentNavbar from '../components/ResidentNavbar.jsx';
import ResidentWindow from '../components/ResidentWindow.jsx';
import ResidentDropdown from '../components/ResidentDropdown.jsx';
import AIChatWindow from '../components/AIChatWindow.jsx';
import OverviewNavbar from '../components/OverviewNavbar.jsx';
import ResidentInfo from '../components/ResidentInfo.jsx';

import KPIWindow from '../components/KPIWindow.jsx';
import SimulationParameters from '../components/SimulationParameters.jsx';
import { useMapData } from '../hooks/useMapData.js';

function OverviewContent() {
    const state = useOverviewState();
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [selectedResidentIndex, setSelectedResidentIndex] = useState(0);
    const [selectedLabels, setSelectedLabels] = useState(["A", "B", "C", "D", "E", "F", "G"]);
    const [selectedWoningTypes, setSelectedWoningTypes] = useState([
        'Twee-onder-een-kap / rijwoning hoek',
        'Rijwoning tussen',
        'Flatwoning (overig)',
        'Appartement',
        'Maisonnette',
    ]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const houses = useMapData();

    const handleHouseClick = (house) => {
        setSelectedHouse(house);
        setSelectedResidentIndex(0);
    };

    const handleResidentSelect = (idx) => {
        setSelectedResidentIndex(idx);
    };

    const handleToggleLabel = (label) => {
        setSelectedLabels(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        );
    };

    const handleToggleWoningType = (type) => {
        setSelectedWoningTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const filteredHouses = houses.filter(h =>
        selectedLabels.includes(h.energyLabel) &&
        (selectedWoningTypes.length === 0 || selectedWoningTypes.includes(h.houseType))
    );

    const selectedResidents = selectedHouse ? selectedHouse.residents : [];
    const selectedResident = selectedResidents[selectedResidentIndex] || null;
    console.log('Selected Resident:', selectedResident);

    return (
        <>
            <OverviewNavbar title="Overview"> </OverviewNavbar>
            <div className={`overview-container${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
                <div className={`sidebar-container${sidebarCollapsed ? ' collapsed' : ''}`}>
                    <SidebarToggle collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />
                    {!sidebarCollapsed && (
                        <MapFilterMenu
                            selectedLabels={selectedLabels}
                            onToggleLabel={handleToggleLabel}
                            selectedWoningTypes={selectedWoningTypes}
                            onToggleWoningType={handleToggleWoningType}
                        />
                    )}
                </div>
                <div className="map-container">
                    {state.chatWindow === 'ai' ? (
                        <AIChatWindow
                            residents={selectedResidents}
                            selectedResidentIndex={selectedResidentIndex}
                        />
                    ) : (
                        <>
                            <MapView houses={filteredHouses} onHouseClick={handleHouseClick} />
                        </>
                    )}
                </div>
                {/* <div className="graphics-container"> // TODO: CHANGE LOCATION
                    <GraphicsView> </GraphicsView>
                </div> */}
                <div className="resident-container">
                    <ResidentNavbar />
                    <ResidentDropdown
                        residents={selectedResidents}
                        selectedResidentIndex={selectedResidentIndex}
                    />
                    <ResidentWindow
                        residents={selectedResidents}
                        selectedResidentIndex={selectedResidentIndex}
                        home={selectedHouse}
                        />
                    <ResidentInfo resident={selectedResident} home={selectedHouse} />
                </div>
                {/* <div className="parameters-container"> // TODO: CHANGE LOCATION
                    <SimulationParameters> </SimulationParameters>
                </div> */}
                <div className="KPI-container">
                    <KPIWindow />
                </div>
            </div>
        </>
    );
}

export const overviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/overview',
    component: function Overview() {
        return (
            <OverviewProvider>
                <OverviewContent />
            </OverviewProvider>
        );
    },
});
