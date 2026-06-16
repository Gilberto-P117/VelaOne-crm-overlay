import {
    CRM_MODULES,
    RETURN_MODULE_MAP,
    ROUTE_VIEW,
} from "./crmRouteConstants";

export function normalizeModuleName(value) {
    if (!value) return null;

    const matchedModule = CRM_MODULES.find((moduleName) => {
        return moduleName.toLowerCase() === value.toLowerCase();
    });

    return matchedModule || null;
}

export function normalizeReturnModule(value) {
    if (!value) return null;

    return RETURN_MODULE_MAP[value] || normalizeModuleName(value);
}

export function getHashRouteParts(url = window.location.href) {
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

export function getRouteStateFromURL(url = window.location.href) {
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