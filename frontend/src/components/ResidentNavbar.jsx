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
        if (state.residentWindow === 'info-resident') {
            dispatch({ type: 'SET_RESIDENT_WINDOW', payload: '' });
        } else {
            dispatch({ type: 'SET_RESIDENT_WINDOW', payload: 'info-resident' });
        }
    };

    /**
     * Toggles the AI chat tab. If the tab is already open, it closes it;
     * otherwise, it opens the tab.
     */
    const toggleAiTab = () => {
        if (state.chatWindow === 'ai') {
            dispatch({ type: 'SET_CHAT_WINDOW', payload: '' });
        } else {
            dispatch({ type: 'SET_CHAT_WINDOW', payload: 'ai' });
        }
    };

    return (
        <div className="navbar-container-resident">
            {/* Info tab button */}
            <div
                className={`info-tab-resident${state.residentWindow === 'info-resident' ? ' selected' : ''}`}
                onClick={toggleInfoTab}
            >
                <h4>Info</h4>
            </div>
            {/* AI chat tab button */}
            <div
                className={`AI-chat-resident${state.chatWindow === 'ai' ? ' selected' : ''}`}
                onClick={toggleAiTab}
            >
                <h4>AI-Chat</h4>
            </div>
        </div>
    );
};

export default ResidentNavbar;
