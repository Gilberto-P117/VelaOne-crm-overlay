import React from "react";
import { getQuoteRelatedRecordIdsFromIframe } from "../../modules/quotes/quoteIframeFields";

export const routeStateViews = {
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
                <button className="get_address_from_account_field" onClick={()=>{getQuoteRelatedRecordIdsFromIframe()}}>
                    <span>Get Account Address</span>
                </button>
            </section>
        ),
        edit: (routeState) => (
            <section className="route_helper_panel">
                <h3>Quote Edit Helper</h3>
                <p>Editing Quote ID: {routeState.recordId}</p>
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