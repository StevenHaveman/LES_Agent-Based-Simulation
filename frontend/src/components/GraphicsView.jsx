import React from 'react';
import '../styles/GraphicsView.css';
import Graphic from './Graphic.jsx';
import PropTypes from 'prop-types';
import { GRAPH_OPTIONS } from './graphOptions.js';

const GraphicsView = ({ selectedGraphs }) => {
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
                <h3 className="graphics-title-centered">Graphs</h3>
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
};

export default GraphicsView;
