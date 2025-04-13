import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createRouter,
    createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "./view/pages/root.jsx";

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
