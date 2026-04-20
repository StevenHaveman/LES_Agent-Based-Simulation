import "../styles/ResidentDropdown.css";
import "../styles/SharedListStyles.css";
import React, { useState } from 'react';

/**
 * ResidentDropdown component provides a dropdown menu for selecting a resident
 * from a list. It displays the currently selected resident and allows toggling
 * the dropdown menu to choose another resident.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.residents - The list of residents available for selection.
 * @param {number|null} props.selectedResidentIndex - The index of the currently selected resident.
 * @param {Function} props.onSelectResident - Callback function to handle resident selection.
 * @returns {JSX.Element} The rendered ResidentDropdown component.
 */
const ResidentDropdown = ({ residents, selectedResidentIndex, onSelectResident }) => {
    // State to track whether the dropdown menu is open or closed.
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handles the click event for a resident in the dropdown menu.
     * Updates the selected resident and closes the dropdown.
     *
     * @param {Object} resident - The resident object being clicked.
     * @param {number} index - The index of the resident in the list.
     */
    const handleResidentClick = (resident, index) => {
        onSelectResident(index);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-container">
            <div className="dropdown">
                {/* Button to toggle the dropdown menu */}
                <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {residents[selectedResidentIndex]?.name || "Select Resident..."} ▼
                </button>
                {/* Dropdown menu displaying the list of residents */}
                {isOpen && (
                    <ul className="dropdown-menu">
                        {residents && residents.length > 0 ? (
                            residents.map((resident, index) => (
                                <li key={index} onClick={() => handleResidentClick(resident, index)}>
                                    {resident.name}
                                </li>
                            ))
                        ) : (
                            <li>Geen residents beschikbaar</li>
                            )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ResidentDropdown;