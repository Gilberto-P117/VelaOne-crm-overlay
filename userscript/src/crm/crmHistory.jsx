import { LOCATION_CHANGE_EVENT } from "./crmRouteConstants";

export function patchBrowserHistory() {
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