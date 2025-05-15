/**
 * Component for displaying a navigation bar with a title and logos.
 *
 * Props:
 * @param {string} title - The title to display in the center of the navigation bar.
 *
 * Returns:
 * A React component that renders a navigation bar with a title and two logos.
 */

import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ title }) => {
    return (
        <div className="navbar">
            <img className="logo" src="LES_logo.png" alt="Logo links" />

            <div className="navbar-center">
                <h1>{title}</h1>
            </div>

            <img className="logo" src="LES_logo2.png" alt="Logo rechts" />
        </div>
    );
};

export default Navbar;