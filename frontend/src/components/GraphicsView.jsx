import React from 'react';
import '../styles/GraphicsView.css';
import Graphic from './Graphic.jsx';
import PropTypes from 'prop-types';
import { GRAPH_OPTIONS } from './graphOptions.js';
import GraphSelector from './GraphSelector.jsx';

const graphSlotsTotal = 3;

const GraphicsView = ({
    selectedGraphs,
    showOptions,
    setShowOptions,
    handleGraphChange,
    graphOptions = GRAPH_OPTIONS,
    graphSlots = graphSlotsTotal,
}) => {
    const graphItems = selectedGraphs
        .map((key) => {
            const option = GRAPH_OPTIONS.find((item) => item.key === key);

            return {
                key,
                title: option ? option.label : key,
            };
        });

    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <div className="graphics-header">
                    <h3 className="graphics-title-centered">Neighborhood Trends</h3>
                    <div className="graphics-chooser">
                        <GraphSelector
                            showOptions={showOptions}
                            setShowOptions={setShowOptions}
                            selectedGraphs={selectedGraphs}
                            handleGraphChange={handleGraphChange}
                            graphOptions={graphOptions}
                            graphSlots={graphSlots}
                        />
                    </div>
                </div>

                {graphItems.map((item) => (
                    <Graphic
                        key={item.key}
                        title={item.title}
                        yAxisKey={item.key}
                    />
                ))}
            </div>
        </div>
    );
};

GraphicsView.propTypes = {
    selectedGraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
    showOptions: PropTypes.bool,
    setShowOptions: PropTypes.func,
    handleGraphChange: PropTypes.func,
    graphOptions: PropTypes.arrayOf(PropTypes.object),
    graphSlots: PropTypes.number,
};

export default GraphicsView;
