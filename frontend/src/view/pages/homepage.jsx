import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import Navbar from "../components/Navbar.jsx";
import "../styles/global.css"


export const configRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: function Index() {
        return (
            <>
                <Navbar></Navbar>
            </>
        );
    },
});
