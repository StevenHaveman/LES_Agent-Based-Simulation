const BASE_URL = 'http://localhost:5000';

export const triggerSustainabilityCampaign = async () => {
    const response = await fetch(`${BASE_URL}/policy/sustainability_campaign`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to trigger sustainability campaign');
    }

    return response.json();
};

export const triggerHeatGridAnnouncement = async () => {
    const response = await fetch(`${BASE_URL}/policy/heat_grid`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to announce heat grid');
    }

    return response.json();
};

export const triggerFinancialSubsidy = async () => {
    const response = await fetch(`${BASE_URL}/policy/financial_subsidy`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to announce financial subsidy');
    }

    return response.json();
};
