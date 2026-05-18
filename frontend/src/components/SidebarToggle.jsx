import React from 'react';
import PropTypes from 'prop-types';
import '../styles/SidebarToggle.css';

function SidebarToggle({ collapsed, onToggle }) {
    return (
        <button className="sidebar-toggle-btn" onClick={onToggle}>
            {collapsed ? '>' : '<'}
        </button>
    );
}

SidebarToggle.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default SidebarToggle;
