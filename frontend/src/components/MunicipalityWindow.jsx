import React from 'react';
import '../styles/municipalityWindow.css';
import { triggerSustainabilityCampaign, triggerHeatGridAnnouncement, triggerFinancialSubsidy } from '../services/PolicyApi';
import { toast } from 'react-toastify';

const MunicipalityWindow = () => {
    const handleFinancialSubsidy = async () => {
        try {
            await triggerFinancialSubsidy();
            toast.success('Financial subsidy applied.');
        } catch (error) {
            toast.error('Failed to apply financial subsidy.');
        }
    };
    const handleSustainabilityCampaign = async () => {
        try {
            await triggerSustainabilityCampaign();
            toast.success('Sustainability campaign triggered.');
        } catch (error) {
            toast.error('Failed to trigger sustainability campaign.');
        }
    };
    const handleHeatGridAnnouncement = async () => {
        try {
            await triggerHeatGridAnnouncement();
            toast.success('Heat grid announcement made.');
        } catch (error) {
            toast.error('Failed to announce heat grid.');
        }
    };
    return (
        <>
            <div className="municipality-window">
                <div className="interventions-container">
                    <div className="intervention-group">
                        <h3>Municipality Options</h3>

                        <button className="intervention-button" onClick={handleFinancialSubsidy}>
                            Financial Subsidy
                        </button>

                        <button className="intervention-button" onClick={handleSustainabilityCampaign}>
                            Sustainability Campaign
                        </button>

                        <button className="intervention-button" onClick={handleHeatGridAnnouncement}>
                            Announce Heat Grid
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
};

export default MunicipalityWindow;
