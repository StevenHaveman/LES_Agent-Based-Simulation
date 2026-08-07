import React, { useState } from 'react';
import '../styles/municipalityWindow.css';
import {
    triggerSustainabilityCampaign,
    triggerHeatGridAnnouncement,
    triggerFinancialSubsidy
} from '../services/PolicyApi';
import { toast } from 'react-toastify';

const MunicipalityWindow = () => {
    const [subsidyAmount, setSubsidyAmount] = useState(1000);

    const handleFinancialSubsidy = async () => {
        try {
            await triggerFinancialSubsidy(subsidyAmount);
            toast.success(`Financial subsidy of €${subsidyAmount} applied.`);
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
                <div className="municipality-container">
                    <h2>Municipality Options</h2>

                    <div className="subsidy-input-container">
                        <label htmlFor="subsidyAmount">
                            Financial Subsidy Amount (€)
                        </label>

                        <input
                            id="subsidyAmount"
                            type="number"
                            min="0"
                            step="100"
                            value={subsidyAmount}
                            onChange={(e) =>
                                setSubsidyAmount(Math.max(0, Number(e.target.value)))
                            }
                        />
                    </div>

                    <button
                        className="intervention-button"
                        onClick={handleFinancialSubsidy}
                    >
                        Apply Financial Subsidy
                    </button>

                    <button
                        className="intervention-button"
                        onClick={handleSustainabilityCampaign}
                    >
                        Sustainability Campaign
                    </button>

                    <button
                        className="intervention-button"
                        onClick={handleHeatGridAnnouncement}
                    >
                        Announce Heat Grid
                    </button>
                </div>
            </div>
        </>
    );
};

export default MunicipalityWindow;