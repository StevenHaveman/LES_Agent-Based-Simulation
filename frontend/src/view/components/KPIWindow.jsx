import React from "react";

import overview_controller from "../../controller/OverviewController.js";
import detail_controller from "../../controller/DetailController.js";

import "../styles/KPIWindow.css";

const KPIWindow = () => {
    /** @type {[Array<{
        "Heat Pump_installed": boolean,
        "Solar Panel_installed": boolean,
        "id": number,
        "name": string,
        "residents": {
                "Heat Pump_decision": boolean,
                "Solar Panel_decision": boolean,
                "income": number,
                "name": string
            }[]
        }>, Function]} */
    const [ house_hold_data, set_house_hold_data ] = React.useState([]);
    const [ loading, set_loading ] = React.useState(true);

    React.useEffect(function () {
        let interval_id;

        async function fetch_households() {
            try {
                set_house_hold_data(await detail_controller.fetch_households());
            } catch (error) {
                console.error("error fetching household data:", error);
            }

            set_loading(false);
        }

        async function start_fetch_loop() {
            /** @type {{ delay: number }} */
            const result = await overview_controller.getDelay();
            const delay_in_ms = (parseInt(result?.delay) || 3) * 1000;

            await fetch_households();

            interval_id = setInterval(fetch_households, delay_in_ms);
        }

        start_fetch_loop();

        return function () {
            if (interval_id)
                clearInterval(interval_id);
        };
    }, []);

    if (loading)
        return <div><h3>Loading...</h3></div>;

    const counted_solar_data_hh = house_hold_data.reduce((prev, cur) => cur["Solar Panel_installed"] ? prev + 1 : prev, 0) ;
    const counted_heat_pump_data_hh = house_hold_data.reduce((prev, cur) => cur["Heat Pump_installed"] ? prev + 1 : prev, 0) ;
    const counted_full_data_hh = house_hold_data.reduce((prev, cur) => cur["Heat Pump_installed"] && cur["Solar Panel_installed"] ? prev + 1 : prev, 0) ;
    const counted_income_total_hh = house_hold_data.reduce((prev, cur) => prev + (cur.residents.reduce((p, c) => p + c.income, 0) / cur.residents.length), 0);
    
    return (
        <>
            <h3>Solar Panels: { Math.round((counted_solar_data_hh / house_hold_data.length) * 100) }%</h3>
            <h3>Heat Pumps: { Math.round((counted_heat_pump_data_hh / house_hold_data.length) * 100) }%</h3>
            <h3>Fully Converted: { Math.round((counted_full_data_hh / house_hold_data.length) * 100) }%</h3>
            <h3>Average Income: { Math.round((counted_income_total_hh / house_hold_data.length)) }€</h3>
        </>
    )
};

export default KPIWindow;