import React from 'react';
import '../styles/HouseholdNavbar.css';
import { useOverviewState, useOverviewDispatch } from '../state/overviewState.jsx';

const HouseholdNavbar = () => {
    const state = useOverviewState();
    const dispatch = useOverviewDispatch();

    const setHouseholdWindowInfo = () =>
        dispatch({ type: 'SET_HOUSEHOLD_WINDOW', payload: 'info' });
    const setHouseholdWindowDecision = () =>
        dispatch({ type: 'SET_HOUSEHOLD_WINDOW', payload: 'decision' });

    return (
        <div className="navbar-container">
            {/* Info tab button */}
            <div
                className={`info-tab${state.householdWindow === 'info' ? ' selected' : ''}`}
                onClick={setHouseholdWindowInfo}
            >
                <h4> Info </h4>
            </div>
            {/* Decisions tab button */}
            <div
                className={`decisions-tab${state.householdWindow === 'decision' ? ' selected' : ''}`}
                onClick={setHouseholdWindowDecision}
            >
                <h4>Decisions</h4>
            </div>
        </div>
    );
};

export default HouseholdNavbar;
