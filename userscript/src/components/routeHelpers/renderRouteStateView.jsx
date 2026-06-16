import React from "react";
import { routeStateViews } from "./routeStateViews";

export function renderRouteStateView(routeState) {
    const moduleViews = routeStateViews[routeState.module];

    if (!moduleViews) {
        return (
            <section className="route_helper_panel route_helper_panel--empty">
                <h3>No Module Helper</h3>
                <p>No recognized module is currently active.</p>
            </section>
        );
    }

    const ViewRenderer = moduleViews[routeState.view];

    if (!ViewRenderer) {
        return (
            <section className="route_helper_panel route_helper_panel--empty">
                <h3>No View Helper</h3>
                <p>
                    No helper exists for {routeState.module}:{routeState.view}.
                </p>
            </section>
        );
    }

    return ViewRenderer(routeState);
}