import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { awaitElement, log, addLocationChangeCallback } from "./utils";

log("React script has successfully started");

const ROOT_ID = "vela-crm-react-root";
const ROOT_GLOBAL_KEY = "__velaCrmReactRoot";
const MOUNTING_GLOBAL_KEY = "__velaCrmReactMounting";

function isInsideIframe() {
    return window.self !== window.top;
}

function getExistingRootContainers() {
    return Array.from(document.querySelectorAll(`#${ROOT_ID}`));
}

//Helper Function for getOrCreateContainer
function removeDuplicateRootContainers() {
    const containers = getExistingRootContainers();

    if (containers.length <= 1) {
        return containers[0] || null;
    }

    const [primaryContainer, ...duplicateContainers] = containers;

    duplicateContainers.forEach((container) => {
        container.remove();
    });

    log(`Removed ${duplicateContainers.length} duplicate React root container(s).`);

    return primaryContainer;
}

function getOrCreateContainer() {
    let container = removeDuplicateRootContainers();

    if (!container) {
        container = document.createElement("div");
        container.id = ROOT_ID;
        document.body.appendChild(container);

        log("Created React root container.");
    }

    return container;
}

async function main() {
    // Critical SuiteCRM iframe guard.
    // Prevents mounting inside legacy iframe views such as Quotes.
    if (isInsideIframe()) {
        log("Skipping React mount inside iframe.");
        return;
    }

    if (window[MOUNTING_GLOBAL_KEY]) {
        log("Mount already in progress. Skipping duplicate mount call.");
        return;
    }

    window[MOUNTING_GLOBAL_KEY] = true;

    try {
        await awaitElement("body");

        const container = getOrCreateContainer();

        if (!window[ROOT_GLOBAL_KEY]) {
            window[ROOT_GLOBAL_KEY] = createRoot(container);
            log("Created React root instance.");
        }

        window[ROOT_GLOBAL_KEY].render(<App />);

        log("React app rendered.");
    } finally {
        window[MOUNTING_GLOBAL_KEY] = false;
    }
}

addLocationChangeCallback(() => {
    main().catch((e) => {
        log(e);
        window[MOUNTING_GLOBAL_KEY] = false;
    });
});