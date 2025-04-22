import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import "../styles/global.css"

export const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/detail",
    component: function Overview() {
        return (
            <>
                <div className={"detail-container"}>
                <h1> Detailscherm </h1>
                </div>

            </>
        )
            ;
    },
});
