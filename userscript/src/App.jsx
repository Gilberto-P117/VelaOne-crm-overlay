import React, { useEffect, useReducer } from "react";
import "./App.css";

const LOCATION_CHANGE_EVENT = "velaone-location-change";

const CRM_MODULES = [
    "home",
    "quotes",
    "invoices",
    "accounts",
    "leads",
    "contacts",
    "cases",
    "V7117_logistics_order_tickets",
];

const RETURN_MODULE_MAP = {
    AOS_Quotes: "quotes",
    AOS_Invoices: "invoices",
    Accounts: "accounts",
    Leads: "leads",
    Contacts: "contacts",
    Cases: "cases",
    V7117_logistics_order_tickets: "V7117_logistics_order_tickets",
};

const ROUTE_VIEW = {
    LIST: "list",
    RECORD: "record",
    EDIT: "edit",
    UNKNOWN: "unknown",
};

const ROUTE_ACTION = {
    ROUTE_CHANGED: "ROUTE_CHANGED",
};

const initialRouteState = {
    module: null,
    view: ROUTE_VIEW.UNKNOWN,
    recordId: null,
    routeModule: null,
    returnModule: null,
    rawPath: "",
    rawUrl: window.location.href,
};

function normalizeModuleName(value) {
    if (!value) return null;

    const matchedModule = CRM_MODULES.find((moduleName) => {
        return moduleName.toLowerCase() === value.toLowerCase();
    });

    return matchedModule || null;
}

function normalizeReturnModule(value) {
    if (!value) return null;

    return RETURN_MODULE_MAP[value] || normalizeModuleName(value);
}

function getHashRouteParts(url = window.location.href) {
    const parsedUrl = new URL(url);

    let hash = parsedUrl.hash || "";
    hash = hash.replace(/^#\/?/, "");

    const [pathPart, hashQueryPart = ""] = hash.split("?");

    const path = `/${pathPart}`.replace(/\/+/g, "/");
    const segments = pathPart.split("/").filter(Boolean);

    const params = new URLSearchParams(hashQueryPart);

    return {
        path,
        segments,
        params,
    };
}

function getRouteStateFromURL(url = window.location.href) {
    const { path, segments, params } = getHashRouteParts(url);

    const routeModuleSegment = segments[0] || null;
    const viewSegment = segments[1] || null;
    const possibleRecordId = segments[2] || null;

    const routeModule = normalizeModuleName(routeModuleSegment);
    const returnModule = normalizeReturnModule(params.get("return_module"));

    let detectedModule = routeModule;
    let detectedView = ROUTE_VIEW.UNKNOWN;
    let recordId = null;

    if (!routeModuleSegment) {
        return {
            module: null,
            view: ROUTE_VIEW.UNKNOWN,
            recordId: null,
            routeModule: null,
            returnModule,
            rawPath: path,
            rawUrl: url,
        };
    }

    // List views:
    // /quotes/index?return_module=AOS_Quotes
    // /invoices/index?return_module=AOS_Invoices
    // /accounts/index?return_module=Accounts
    if (viewSegment?.toLowerCase() === "index") {
        detectedModule = returnModule || routeModule;
        detectedView = ROUTE_VIEW.LIST;
    }

    // Record/detail views:
    // /quotes/record/{record-id}
    // /invoices/record/{record-id}
    // /accounts/record/{record-id}
    // /V7117_logistics_order_tickets/record/{record-id}
    else if (viewSegment?.toLowerCase() === "record") {
        detectedModule = routeModule;
        detectedView = ROUTE_VIEW.RECORD;
        recordId = possibleRecordId || null;
    }

    // Explicit edit views:
    // /quotes/edit/{record-id}?return_module=AOS_Quotes
    // /invoices/edit/{record-id}?return_module=AOS_Invoices
    //
    // Leads, Accounts, Contacts, Cases, and custom modules currently stay
    // on the record/detail route while editing, based on observed routing.
    else if (viewSegment?.toLowerCase() === "edit") {
        detectedModule = returnModule || routeModule;
        detectedView = ROUTE_VIEW.EDIT;
        recordId = possibleRecordId || null;
    }

    // Custom module list view:
    // /V7117_logistics_order_tickets
    else if (routeModule === "V7117_logistics_order_tickets" && !viewSegment) {
        detectedModule = routeModule;
        detectedView = ROUTE_VIEW.LIST;
    }

    // Home:
    // /home
    else if (routeModule === "home") {
        detectedModule = "home";
        detectedView = ROUTE_VIEW.LIST;
    }

    return {
        module: detectedModule,
        view: detectedView,
        recordId,
        routeModule,
        returnModule,
        rawPath: path,
        rawUrl: url,
    };
}

function routeStateReducer(state, action) {
    switch (action.type) {
        case ROUTE_ACTION.ROUTE_CHANGED: {
            const nextRouteState = action.payload;

            const routeDidNotChange =
                state.module === nextRouteState.module &&
                state.view === nextRouteState.view &&
                state.recordId === nextRouteState.recordId &&
                state.rawUrl === nextRouteState.rawUrl;

            if (routeDidNotChange) {
                return state;
            }

            return nextRouteState;
        }

        default:
            return state;
    }
}

const routeStateViews = {
    home: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Home Helper</h3>
                <p>Home route is active.</p>
            </section>
        ),
    },

    quotes: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Quotes List Helper</h3>
                <p>Quotes list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Quote Record Helper</h3>
                <p>Quote Record ID: {routeState.recordId}</p>
            </section>
        ),
        edit: (routeState) => (
            <section className="route_helper_panel">
                <h3>Quote Edit Helper</h3>
                <p>Editing Quote ID: {routeState.recordId}</p>
                <div className="get_address_from_account_field" onClick={()=>{console.log("Quote Edit Route State")}}>
                    <span>Get Account Address</span>
                </div>
            </section>
        ),
    },

    invoices: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Invoices List Helper</h3>
                <p>Invoices list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Invoice Record Helper</h3>
                <p>Invoice Record ID: {routeState.recordId}</p>
            </section>
        ),
        edit: (routeState) => (
            <section className="route_helper_panel">
                <h3>Invoice Edit Helper</h3>
                <p>Editing Invoice ID: {routeState.recordId}</p>
            </section>
        ),
    },

    accounts: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Accounts List Helper</h3>
                <p>Accounts list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Account Record Helper</h3>
                <p>Account Record ID: {routeState.recordId}</p>
            </section>
        ),
    },

    leads: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Leads List Helper</h3>
                <p>Leads list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Lead Record Helper</h3>
                <p>Lead Record ID: {routeState.recordId}</p>
            </section>
        ),
    },

    contacts: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Contacts List Helper</h3>
                <p>Contacts list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Contact Record Helper</h3>
                <p>Contact Record ID: {routeState.recordId}</p>
            </section>
        ),
    },

    cases: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Cases List Helper</h3>
                <p>Cases list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Case Record Helper</h3>
                <p>Case Record ID: {routeState.recordId}</p>
            </section>
        ),
    },

    V7117_logistics_order_tickets: {
        list: () => (
            <section className="route_helper_panel">
                <h3>Logistics Tickets List Helper</h3>
                <p>Logistics ticket list view is active.</p>
            </section>
        ),
        record: (routeState) => (
            <section className="route_helper_panel">
                <h3>Logistics Ticket Record Helper</h3>
                <p>Ticket Record ID: {routeState.recordId}</p>
            </section>
        ),
    },
};

function renderRouteStateView(routeState) {
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

function patchBrowserHistory() {
    if (window.__velaoneHistoryPatched) return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
        const result = originalPushState.apply(this, args);
        window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
        return result;
    };

    window.history.replaceState = function (...args) {
        const result = originalReplaceState.apply(this, args);
        window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
        return result;
    };

    window.__velaoneHistoryPatched = true;
}

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
