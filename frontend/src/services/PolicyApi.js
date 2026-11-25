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

export const triggerFinancialSubsidy = async (amount) => {
    const response = await fetch(`${BASE_URL}/policy/financial_subsidy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: amount,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to apply financial subsidy');
    }

    return response.json();
};