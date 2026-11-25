import React, { useState } from 'react';
import '../styles/MunicipalityWindow.css';
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
        <div className="panel">
            <h3 className="panel-title">Municipality Options</h3>

            <div className="panel-section">
                <label className="panel-label" htmlFor="subsidyAmount">
                    Financial subsidy
                </label>

                <div className="panel-input-row">
                    <div className="panel-input-prefix">
                        <span aria-hidden="true">€</span>
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
                        type="button"
                        className="panel-button"
                        onClick={handleFinancialSubsidy}
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="panel-section">
                <span className="panel-label">Campaigns</span>

                <div className="panel-button-row">
                    <button
                        type="button"
                        className="panel-button"
                        onClick={handleSustainabilityCampaign}
                    >
                        Sustainability Campaign
                    </button>

                    <button
                        type="button"
                        className="panel-button"
                        onClick={handleHeatGridAnnouncement}
                    >
                        Announce Heat Grid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MunicipalityWindow;
