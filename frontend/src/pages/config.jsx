import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import ConfigForm from "../components/ConfigForm.jsx";
import "../styles/globalPageStyles.css";
import ConfigNavbar from "../components/ConfigNavbar.jsx";


export const configRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: function Config() {
        return (
            <>
                <ConfigNavbar title={"Configuration"}> </ConfigNavbar>
                <ConfigForm></ConfigForm>
            </>
        );
    },
});
