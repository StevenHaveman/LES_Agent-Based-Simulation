import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";


export const homePageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: function Index() {
        return (
            <>
              <h1> IDK</h1>
            </>
        );
    },
});
