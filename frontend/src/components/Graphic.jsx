import React, { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

import PropTypes from "prop-types";

import "../styles/Graphic.css";

import { useOverview } from "../hooks/useOverview.js";
import { useSimulationRun } from "../hooks/useSimulationRun.js";

import EnergyChart from "../charts/EnergyChart";
import Co2Chart from "../charts/Co2Chart";
import KpiChart from "../charts/KpiChart";
import ClusterChart from "../charts/ClusterChart";
import ClusterTrendChart from "../charts/ClusterTrendChart";

const validKeys = [
  "energy_label_A",
  "energy_label_B",
  "energy_label_C",
  "energy_label_D",
  "energy_label_E",
  "energy_label_F",
  "energy_label_G",
  "co2",
  "kpi_stock",
  "cluster_behavior_data",
  "cluster_behavior_trends",
];

const delayMs = 1000;
const defaultSimulationDelaySeconds = 3;
const simulationYearStart = 2025;

const barPercentageNummer = 1.0;
const categoryPercentageNummer = 1.0;

const clusterMetrics = [
  {
    key: "average_attitude",
    label: "Attitude",
    color: "#0095ff",
  },

  {
    key: "average_perceived_norm",
    label: "Perceived Norm",
    color: "#ff7801",
  },

  {
    key: "average_pbc",
    label: "PBC",
    color: "#238b23",
  },
];

const chartOptions = {
  responsive: true,

  interaction: {
    mode: "index",
    intersect: false,
  },

  plugins: {
    legend: {
      position: "top",
    },
  },

  scales: {
    x: {
      stacked: true,
    },

    y: {
      stacked: true,
    },
  },
};

const Graphic = ({ title = "", yAxisKey = "" }) => {
  const [simulationData, setSimulationData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedClusterMetric, setSelectedClusterMetric] = useState(
    clusterMetrics[0].key,
  );

  const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const result = await useOverview().getSimulationGraphicResults();

        setSimulationData(result);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching simulation data", error);

        setLoading(false);
      }
    };

    const fetchInterval = async () => {
      const res = await useSimulationRun().getSimulationDelay();

      const delay =
        parseInt(res.delay || defaultSimulationDelaySeconds) * delayMs;

      await fetchData();

      intervalId = setInterval(fetchData, delay);
    };

    fetchInterval();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const uniqueSimulationData = Array.from(
    new Map(simulationData.map((item) => [item.year, item])).values(),
  );
  const chartComponents = {
    co2: (
      <Co2Chart
        uniqueSimulationData={uniqueSimulationData}
        simulationYearStart={simulationYearStart}
      />
    ),

    kpi_stock: (
      <KpiChart
        uniqueSimulationData={uniqueSimulationData}
        simulationYearStart={simulationYearStart}
        chartOptions={chartOptions}
        barPercentageNummer={barPercentageNummer}
        categoryPercentageNummer={categoryPercentageNummer}
      />
    ),

    cluster_behavior_data: (
      <ClusterChart
        uniqueSimulationData={uniqueSimulationData}
        simulationYearStart={simulationYearStart}
        selectedClusterMetric={selectedClusterMetric}
        clusterMetrics={clusterMetrics}
        chartOptions={chartOptions}
      />
    ),

    cluster_behavior_trends: (
      <ClusterTrendChart
        uniqueSimulationData={uniqueSimulationData}
        simulationYearStart={simulationYearStart}
        selectedClusterMetric={selectedClusterMetric}
        clusterMetrics={clusterMetrics}
      />
    ),
  };

  const selectedChart = yKey.startsWith("energy_label") ? (
    <EnergyChart
      uniqueSimulationData={uniqueSimulationData}
      simulationYearStart={simulationYearStart}
      chartOptions={chartOptions}
      barPercentageNummer={barPercentageNummer}
      categoryPercentageNummer={categoryPercentageNummer}
    />
  ) : (
    chartComponents[yKey]
  );

  return (
    <div className="graphic-container">
      <h3 className="graphic-title">{title}</h3>

    {/* Cluster dropdown */}
      {(yKey === "cluster_behavior_data" ||
        yKey === "cluster_behavior_trends") && (
        <div style={{ marginBottom: "1em" }}>
          <label htmlFor="cluster-metric-select">Select metric:&nbsp;</label>

          <select
            id="cluster-metric-select"
            value={selectedClusterMetric}
            onChange={(e) => setSelectedClusterMetric(e.target.value)}
          >
            {clusterMetrics.map((metric) => (
              <option key={metric.key} value={metric.key}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="graphic-square-wrapper">
        {selectedChart || <div>Invalid key</div>}
      </div>
    </div>
  );
};

Graphic.propTypes = {
  title: PropTypes.string,
  yAxisKey: PropTypes.string,
};

export default Graphic;
