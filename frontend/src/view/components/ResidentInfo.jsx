
import "../styles/ResidentInfo.css";

const ResidentInfo = ({resident}) => {
    if (!resident) return  <div className="select-resident-hint">
        <h3> Click on a Resident</h3>
    </div>;

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