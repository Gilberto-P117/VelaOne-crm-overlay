import React, { useEffect, useReducer, useState } from "react";
import "./App.css";

import { LOCATION_CHANGE_EVENT, ROUTE_ACTION } from "./crm/crmRouteConstants";
import { getRouteStateFromURL } from "./crm/crmRoutes";
import { patchBrowserHistory } from "./crm/crmHistory";
import { initialRouteState, routeStateReducer } from "./state/routeState";
import { renderRouteStateView } from "./components/routeHelpers/renderRouteStateView";

function App() {

    const [routeState, dispatchRouteState] = useReducer(
        routeStateReducer,
        initialRouteState
    );
        

    useEffect(() => {
        patchBrowserHistory();

        const updateRouteState = () => {
            const nextRouteState = getRouteStateFromURL();

            dispatchRouteState({
                type: ROUTE_ACTION.ROUTE_CHANGED,
                payload: nextRouteState,
            });
        };

        updateRouteState();

        window.addEventListener("hashchange", updateRouteState);
        window.addEventListener("popstate", updateRouteState);
        window.addEventListener(LOCATION_CHANGE_EVENT, updateRouteState);

        return () => {
            window.removeEventListener("hashchange", updateRouteState);
            window.removeEventListener("popstate", updateRouteState);
            window.removeEventListener(LOCATION_CHANGE_EVENT, updateRouteState);
        };
    }, []);

    return (
        <div className="velaone_dashboard_overlay_app">
            <div className="app_body_container">
                <p>CRM Assistant</p>

                <div className="module_helper_container">
                    {renderRouteStateView(routeState)}
                </div>
            </div>
        </div>
    );
}

export default App;