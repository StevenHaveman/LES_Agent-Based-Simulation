import React, { createContext, useContext, useReducer } from 'react';

const OverviewStateContext = createContext(null);
const OverviewDispatchContext = createContext(null);

const initialState = {
    selectedHouseholdId: null,
    selectedResidents: [],
    selectedResidentIndex: null,
    householdWindow: '',
    residentWindow: '',
    chatWindow: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'SELECT_HOUSEHOLD':
            return {
                ...state,
                selectedHouseholdId: action.payload.id,
                selectedResidents: action.payload.residents || [],
                selectedResidentIndex: null,
            };
        case 'SELECT_RESIDENT':
            return { ...state, selectedResidentIndex: action.payload };
        case 'SET_CHAT_WINDOW':
            return { ...state, chatWindow: action.payload };
        case 'SET_HOUSEHOLD_WINDOW':
            return { ...state, householdWindow: action.payload };
        case 'SET_RESIDENT_WINDOW':
            return { ...state, residentWindow: action.payload };
        default:
            return state;
    }
}

export function OverviewProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <OverviewStateContext.Provider value={state}>
            <OverviewDispatchContext.Provider value={dispatch}>
                {children}
            </OverviewDispatchContext.Provider>
        </OverviewStateContext.Provider>
    );
}

export function useOverviewState() {
    const context = useContext(OverviewStateContext);
    if (!context) {
        throw new Error('useOverviewState must be used within OverviewProvider');
    }
    return context;
}

export function useOverviewDispatch() {
    const context = useContext(OverviewDispatchContext);
    if (!context) {
        throw new Error('useOverviewDispatch must be used within OverviewProvider');
    }
    return context;
}

export function useOverview() {
    return {
        state: useOverviewState(),
        dispatch: useOverviewDispatch(),
    };
}
