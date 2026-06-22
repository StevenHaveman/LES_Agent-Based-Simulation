import React, { useState, useEffect } from 'react';
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
import AIChatWindow from '../components/AIChatWindow.jsx';
import OverviewNavbar from '../components/OverviewNavbar.jsx';

import KPIWindow from '../components/KPIWindow.jsx';
import MunicipalityWindow from '../components/MunicipalityWindow.jsx';
import SimulationMunicipalityWindow from '../components/SimulationMunicipalityWindow.jsx';
import { useMapData } from '../hooks/useMapData.js';
import { useSimulationYear } from '../hooks/useSimulationYear.js';
import { GRAPH_OPTIONS, GRAPH_SLOTS } from '../components/graphOptions.js';

import '@fontsource/montserrat';

const simulationYearStart = 2024;

function OverviewContent() {
    const state = useOverviewState();
    const [showGraphOptions, setShowGraphOptions] = useState(false);
    const [selectedGraphs, setSelectedGraphs] = useState([
        'cluster_behavior_trends',
        'co2',
        'kpi_stock'
    ]);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [selectedResidentIndex, setSelectedResidentIndex] = useState(0);
    const [selectedLabels, setSelectedLabels] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    const [selectedWoningTypes, setSelectedWoningTypes] = useState([
        'Row House',
        'Apartment',
    ]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [clusterMode, setClusterMode] = useState(false);
    const [selectedClusterTypes, setSelectedClusterTypes] = useState([
        'engaged',
        'neutral',
        'resistant',
    ]);
    
    const year = useSimulationYear();
    const houses = useMapData(year);

    useEffect(() => {
        if (selectedHouse && houses.length > 0) {
            const updatedHouse = houses.find(h => h.id === selectedHouse.id);
            if (updatedHouse) {
                setSelectedHouse(updatedHouse);
            }
        }
    }, [houses]);

    const handleHouseClick = (house) => {
        setSelectedHouse(house);
        setSelectedResidentIndex(0);
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

    const handleToggleClusterMode = (value) => {
        setClusterMode(!!value);
    };

    const handleToggleClusterType = (type) => {
        setSelectedClusterTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleGraphChange = (idx, newKey) => {
        if (selectedGraphs.includes(newKey)) {return;}

        const newGraphs = [...selectedGraphs];
        newGraphs[idx] = newKey;
        setSelectedGraphs(newGraphs);
    };

    const filteredHouses = houses.filter(h =>
        selectedLabels.includes(h.energyLabel) &&
        (selectedWoningTypes.length === 0 || selectedWoningTypes.includes(h.houseType)) &&
        (!clusterMode || selectedClusterTypes.length === 0 || (h.residents || []).some(r => selectedClusterTypes.includes(r.cluster_type)))
    );

    const selectedResidents = selectedHouse ? selectedHouse.residents : [];

    return (
        <>
            <OverviewNavbar title="INSIGHT: Integrated Neighborhood Simulation for Informing Green Housing Transitions
 " year={year + simulationYearStart} />
            <div className={`overview-container${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
                <div className={`sidebar-container${sidebarCollapsed ? ' collapsed' : ''}`}>
                    <SidebarToggle collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />
                    {!sidebarCollapsed && (
                        <MapFilterMenu
                            selectedLabels={selectedLabels}
                            onToggleLabel={handleToggleLabel}
                            selectedWoningTypes={selectedWoningTypes}
                            onToggleWoningType={handleToggleWoningType}
                            clusterMode={clusterMode}
                            onToggleClusterMode={handleToggleClusterMode}
                            selectedClusterTypes={selectedClusterTypes}
                            onToggleClusterType={handleToggleClusterType}
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
                            <MapView houses={filteredHouses} onHouseClick={handleHouseClick} selectedHouse={selectedHouse} clusterMode={clusterMode} />
                        </>
                    )}
                </div>
                <div className="resident-container">
                    <ResidentNavbar />
                    <ResidentWindow
                        residents={selectedResidents}
                        selectedResidentIndex={selectedResidentIndex}
                        home={selectedHouse}
                        onResidentChange={setSelectedResidentIndex}
                    />
                </div>
                <div className="municipality-container">
                    <MunicipalityWindow />
                </div>
                <div className="simulation-municipality-container">
                    <SimulationMunicipalityWindow />
                </div>
                <div className="kpi-container">
                    <KPIWindow year={year + simulationYearStart} />
                </div>
                <div className="charts-container">
                    <GraphicsView
                        selectedGraphs={selectedGraphs}
                        showOptions={showGraphOptions}
                        setShowOptions={setShowGraphOptions}
                        handleGraphChange={handleGraphChange}
                        graphOptions={GRAPH_OPTIONS}
                        graphSlots={GRAPH_SLOTS}
                    />
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
