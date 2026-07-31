import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';


const MunicipalityTimelineChart = ({
    municipalityEvents,
    simulationYearStart,
}) => {

    const timelineData = {
        datasets: [
            {
                label: 'Municipality Actions',

                data: municipalityEvents.map((item) => {

                    const sameYearEvents = municipalityEvents.filter(
                        event => event.year === item.year
                    );

                    const positionInYear = sameYearEvents.findIndex(
                        event => event === item
                    );

                    return {
                        x: simulationYearStart + item.year - 1,
                        y: positionInYear + 1,
                        event: item.event,
                        details: item.details,
                    };
                }),

                pointRadius: 8,
            },
        ],
    };


    const maxEventsInYear = Math.max(
        ...municipalityEvents.map(event =>
            municipalityEvents.filter(
                e => e.year === event.year
            ).length
        ),
        1
    );


    const timelineOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: 'top',
            },

            tooltip: {
                callbacks: {
                    label: (context) => {

                        const point = context.raw;

                        const details = point.details
                            ? Object.entries(point.details)
                                .map(([key, value]) => `${key}: ${value}`)
                            : [];

                        return [
                            `Year: ${point.x}`,
                            `Action: ${point.event}`,
                            ...details,
                        ];
                    },
                },
            },
        },

        scales: {

            x: {
                type: 'linear',

                title: {
                    display: true,
                    text: 'Simulation year',
                },

                ticks: {
                    precision: 0,
                    stepSize: 1,

                    maxRotation: 45,
                    minRotation: 45,

                    callback: (value) => value.toString(),
                },
            },


            y: {
                ticks: {
                    callback: () => '',
                },

                title: {
                    display: false,
                },

                min: 0,
                max: maxEventsInYear + 1,
            },
        },
    };


    return (
        <Scatter
            data={timelineData}
            options={timelineOptions}
        />
    );
};


export default MunicipalityTimelineChart;


MunicipalityTimelineChart.propTypes = {
    municipalityEvents: PropTypes.arrayOf(
        PropTypes.object
    ).isRequired,

    simulationYearStart: PropTypes.number.isRequired,
};