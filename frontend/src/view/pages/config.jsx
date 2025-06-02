import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import Navbar from "../components/Navbar.jsx";
import ConfigForm from "../components/ConfigForm.jsx";
import "../styles/globalPageStyles.css";


export const configRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: function Config() {
        return (
            <>
                <Navbar title={"MVP Config"}></Navbar>
                <ConfigForm></ConfigForm>
            </>
        );
    },
});
