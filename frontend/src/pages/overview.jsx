import React from 'react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';
import '../styles/overviewpage.css';
import '../styles/globalPageStyles.css';
import { OverviewProvider, useOverviewState } from '../state/overviewState.jsx';

import GraphicsView from '../components/GraphicsView.jsx';
import HouseholdMap from '../components/HouseholdMap.jsx';
import HouseholdWindow from '../components/HouseholdWindow.jsx';
import HouseholdNavbar from '../components/HouseholdNavbar.jsx';
import ResidentNavbar from '../components/ResidentNavbar.jsx';
import ResidentWindow from '../components/ResidentWindow.jsx';
import ResidentDropdown from '../components/ResidentDropdown.jsx';
import AIChatWindow from '../components/AIChatWindow.jsx';
import OverviewNavbar from '../components/OverviewNavbar.jsx';

import KPIWindow from '../components/KPIWindow.jsx';
import SimulationParameters from '../components/SimulationParameters.jsx';

function OverviewContent() {
    const state = useOverviewState();

    return (
        <>
            <OverviewNavbar title="Overview"> </OverviewNavbar>
            <div className="overview-container">
                <div className="map-container">
                    {state.chatWindow === 'ai' ? (
                        <AIChatWindow
                            residents={state.selectedResidents}
                            selectedResidentIndex={state.selectedResidentIndex}
                        />
                    ) : (
                        <HouseholdMap
                            selectedHouseholdId={state.selectedHouseholdId}
                        />
                    )}
                </div>
                <div className="graphics-container">
                    <GraphicsView> </GraphicsView>
                </div>
                <div className="household-container">
                    <HouseholdNavbar />
                    <HouseholdWindow
                        selectedHouseholdId={state.selectedHouseholdId}
                    />
                </div>
                <div className="resident-container">
                    <ResidentNavbar />
                    <ResidentDropdown
                        residents={state.selectedResidents}
                        selectedResidentIndex={state.selectedResidentIndex}
                    />
                    <ResidentWindow
                        residents={state.selectedResidents}
                        selectedResidentIndex={state.selectedResidentIndex}
                    />
                </div>
                <div className="parameters-container">
                    <SimulationParameters> </SimulationParameters>
                </div>
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
