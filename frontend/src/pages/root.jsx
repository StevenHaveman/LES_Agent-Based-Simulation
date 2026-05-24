import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { configRoute } from './config.jsx';
import { overviewRoute } from './overview.jsx';

export const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
        </>
    ),
});

export const routeTree = rootRoute.addChildren([configRoute, overviewRoute]);
