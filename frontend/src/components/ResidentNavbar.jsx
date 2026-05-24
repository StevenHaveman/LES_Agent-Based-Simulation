import React from 'react';
import '../styles/ResidentNavbar.css';
import { useOverviewState, useOverviewDispatch } from '../state/overviewState.jsx';

const ResidentNavbar = () => {
    const state = useOverviewState();
    const dispatch = useOverviewDispatch();

    /**
     * Toggles the resident information tab. If the tab is already open, it closes it;
     * otherwise, it opens the tab.
     */
    const toggleInfoTab = () => {
        dispatch({ type: 'SET_RESIDENT_WINDOW', payload: 'info-resident' });
        dispatch({ type: 'SET_CHAT_WINDOW', payload: '' });
    };

    /**
     * Toggles the AI chat tab. If the tab is already open, it closes it;
     * otherwise, it opens the tab.
     */
    const toggleAiTab = () => {
        dispatch({ type: 'SET_CHAT_WINDOW', payload: 'ai' });
    };

    const toggleHomeTab = () => {
        dispatch({ type: 'SET_RESIDENT_WINDOW', payload: 'info-home' });
        dispatch({ type: 'SET_CHAT_WINDOW', payload: '' });
    };

    return (
        <div className="navbar-container-resident">
            {/* Info tab button */}
            <div
                className={`info-tab-resident${state.residentWindow === 'info-resident' ? ' selected' : ''}`}
                onClick={toggleInfoTab}
            >
                <h4>Resident details</h4>
            </div>
            {/* AI chat tab button */}
            <div
                className={`AI-chat-resident${state.chatWindow === 'ai' ? ' selected' : ''}`}
                onClick={toggleAiTab}
            >
                <h4>AI chat</h4>
            </div>
            <div
                className={`home-tab-resident${state.residentWindow === 'info-home' ? ' selected' : ''}`}
                onClick={toggleHomeTab}
            >
                <h4>Home details</h4>
            </div>
        </div>
    );
};

export default ResidentNavbar;
