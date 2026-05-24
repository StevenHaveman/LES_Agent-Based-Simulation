import React from 'react';
import PropTypes from 'prop-types';
import { GRAPH_OPTIONS, GRAPH_SLOTS } from './graphOptions.js';

const GraphSelector = ({
    showOptions,
    setShowOptions,
    selectedGraphs,
    handleGraphChange,
    graphOptions,
    graphSlots,
}) => {
    return (
        <>
            <button title="Choose your graphs" onClick={() => setShowOptions((value) => !value)}>
                <span class="material-symbols-outlined">settings</span>
            </button>

            {showOptions && (
                <div
                    className="graphics-modal-overlay"
                    onClick={() => setShowOptions(false)}
                >
                    <div
                        className="graphics-options-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h4 className="graphics-modal-title">
                            Select 3 graphs to display:
                        </h4>

                        {Array.from({ length: graphSlots }).map((_, idx) => (
                            <div key={idx} className="graphic-modal-row">
                                <label>Graph {idx + 1}:&nbsp;</label>

                                <select
                                    value={selectedGraphs[idx]}
                                    onChange={(event) => handleGraphChange(idx, event.target.value)}
                                >
                                    {graphOptions
                                        .filter((option) =>
                                            !selectedGraphs.includes(option.key)
                                            || selectedGraphs[idx] === option.key,
                                        )
                                        .map((option) => (
                                            <option key={option.key} value={option.key}>
                                                {option.label}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        ))}

                        <button
                            className="graphics-modal-close"
                            onClick={() => setShowOptions(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

GraphSelector.propTypes = {
    showOptions: PropTypes.bool.isRequired,
    setShowOptions: PropTypes.func.isRequired,
    selectedGraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleGraphChange: PropTypes.func.isRequired,
    graphOptions: PropTypes.arrayOf(PropTypes.object),
    graphSlots: PropTypes.number,
};

GraphSelector.defaultProps = {
    graphOptions: GRAPH_OPTIONS,
    graphSlots: GRAPH_SLOTS,
};

export default GraphSelector;
