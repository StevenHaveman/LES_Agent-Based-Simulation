import "../styles/ResidentInfo.css";

/**
 * ResidentInfo component displays detailed information about a selected resident,
 * including their name and income. If no resident is selected, it shows a hint message.
 *
 * @param {Object} props - The component props.
 * @param {Object|null} props.resident - The selected resident object containing their details.
 * @param {string} props.resident.name - The name of the resident.
 * @param {number} props.resident.income - The income of the resident.
 * @returns {JSX.Element} The rendered ResidentInfo component.
 */
const ResidentInfo = ({ resident }) => {
    // If no resident is selected, render a hint message.
    if (!resident) return <div className="select-resident-hint">
        <h3> Click on a Resident</h3>
    </div>;

    // Render the resident's information.
    return (
        <div className="resident_info-container">
            <div className="info">
                <h3>Naam: {resident.name}</h3>
                <h3>Inkomen: €{resident.income + ",-"}</h3>
            </div>
        </div>
    );
};

export default ResidentInfo;