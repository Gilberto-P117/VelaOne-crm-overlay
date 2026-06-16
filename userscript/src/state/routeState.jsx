import { ROUTE_ACTION, ROUTE_VIEW } from "../crm/crmRouteConstants";

export const initialRouteState = {
    module: null,
    view: ROUTE_VIEW.UNKNOWN,
    recordId: null,
    routeModule: null,
    returnModule: null,
    rawPath: "",
    rawUrl: window.location.href,
};

export function routeStateReducer(state, action) {
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