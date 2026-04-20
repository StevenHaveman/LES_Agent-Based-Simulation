/**
 * ConfigNavbar Component
 *
 * This React component renders a navigation bar with a title and two logos.
 * The navigation bar is styled using the `ConfigNavbar.css` file.
 *
 * Props:
 * - `title` (string): The title to display in the center of the navigation bar.
 *
 * Returns:
 * - A React component that displays:
 *   - A logo on the left side.
 *   - A title in the center.
 *   - A logo on the right side.
 *
 * Usage:
 * - Import the component and pass a `title` prop to customize the displayed title.
 * - Ensure the `LES_logo.png` and `LES_logo2.png` images are available in the appropriate directory.
 */

import React from "react";
import "../styles/ConfigNavbar.css";

const ConfigNavbar = ({ title }) => {
    return (
        <div className="navbar">
            {/* Left logo */}
            <img className="logo" src="LES_logo.png" alt="Logo links" />

            {/* Center title */}
            <div className="navbar-center">
                <h1>{title}</h1>
            </div>

            {/* Right logo */}
            <img className="logo" src="LES_logo2.png" alt="Logo rechts" />
        </div>
    );
};

export default ConfigNavbar;