import React from 'react';
import '../styles/GraphicsView.css';
import Graphic from './Graphic.jsx';
import PropTypes from 'prop-types';
import { GRAPH_OPTIONS } from './graphOptions.js';
import GraphSelector from './GraphSelector.jsx';
import { useOverview } from '../hooks/useOverview.js';

const graphSlotsTotal = 3;

const GraphicsView = ({
    selectedGraphs,
    showOptions,
    setShowOptions,
    handleGraphChange,
    graphOptions = GRAPH_OPTIONS,
    graphSlots = graphSlotsTotal,
}) => {

    const [simulationData, setSimulationData] = React.useState([]);
    const [households, setHouseholds] = React.useState([]);

    const lastYearRef = React.useRef(null);

    // Hooks moeten hier staan
    const overview = useOverview();


    React.useEffect(() => {


        const fetchData = async () => {

            try {

                const result = await overview.getSimulationGraphicResults();

                if (!result || result.length === 0) {
                    return;
                }


                const latestYear = result[result.length - 1]?.year;


                // Update alleen als nieuwe data beschikbaar is
                if (latestYear !== lastYearRef.current) {

                    lastYearRef.current = latestYear;

                    setSimulationData(result);


                    const householdData =
                        await overview.fetchHouseholds();


                    setHouseholds(householdData);
                }


            } catch (error) {

                console.error(
                    "Failed loading graphics data:",
                    error
                );

            }

        };


        // Poll on a short fixed interval instead of the simulation delay:
        // fetchData only updates state when a new year is available, so this
        // follows any delay the user picks (including 0 sec) without refetching
        // the delay itself.
        const pollIntervalMs = 1000;

        // Eerste keer direct laden
        fetchData();

        const intervalId = setInterval(
            fetchData,
            pollIntervalMs
        );


        return () => {
            clearInterval(intervalId);
        };

    // `overview` is a new object on every render; polling should start once.
    }, []);



    const graphItems = selectedGraphs.map((key) => {

        const option =
            GRAPH_OPTIONS.find(
                (item) => item.key === key
            );


        return {
            key,
            title: option ? option.label : key,
        };

    });



    return (

        <div className="graphics-view-container">

            <div className="graphic-wrapper">

                <div className="graphics-header">

                    <h3 className="graphics-title-centered">
                        Neighborhood Trends
                    </h3>


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
                        simulationData={simulationData}
                        households={households}
                    />

                ))}


            </div>

        </div>

    );

};



GraphicsView.propTypes = {

    selectedGraphs:
        PropTypes.arrayOf(
            PropTypes.string
        ).isRequired,

    showOptions:
        PropTypes.bool,

    setShowOptions:
        PropTypes.func,

    handleGraphChange:
        PropTypes.func,

    graphOptions:
        PropTypes.arrayOf(
            PropTypes.object
        ),

    graphSlots:
        PropTypes.number,

};



export default GraphicsView;