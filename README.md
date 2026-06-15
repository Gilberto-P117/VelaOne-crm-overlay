# SuiteCRM Dashboard Overlay App

A lightweight React dashboard overlay for SuiteCRM 8.x.

This project is designed to enhance an existing SuiteCRM instance by adding a compact, non-intrusive interface layer on top of the native CRM experience. It is not intended to replace SuiteCRM or rebuild the CRM from scratch. Instead, it provides a focused frontend overlay that can display useful record context, dashboard summaries, workflow signals, and module-specific insights while the user continues working inside SuiteCRM.

## Project Overview

The SuiteCRM Dashboard Overlay App runs in the browser as a userscript. It is developed with React and executed through Tampermonkey, allowing the overlay to be injected into SuiteCRM without modifying SuiteCRM core files.

The main goal is to give users faster access to important CRM context, such as records that need attention, current module/page awareness, lightweight dashboard summaries, and future scoring or prioritization features.

## Core Goals

- Add a React-powered overlay to SuiteCRM
- Keep the overlay compact and non-disruptive
- Detect the current SuiteCRM route or module
- Display useful dashboard and record context
- Support list and record drill-down views
- Use SuiteCRM's existing authenticated browser session
- Retrieve CRM data through SuiteCRM GraphQL
- Respect SuiteCRM permissions and workflow behavior
- Avoid interfering with native SuiteCRM controls

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React |
| Runtime | Tampermonkey userscript |
| Development base | `siefkenj/react-userscripts` |
| Host application | SuiteCRM 8.x |
| Data access | SuiteCRM GraphQL |
| Actions / mutations | SuiteCRM Process API via `createProcess` |
| Styling | CSS |

## How It Works

At runtime, Tampermonkey executes the userscript inside the SuiteCRM browser page. The script safely mounts a React root into the page and renders the overlay UI.

The overlay uses the user's existing SuiteCRM browser session for authenticated requests. This allows it to query SuiteCRM data through the GraphQL API without requiring a separate login flow for the overlay itself.

Because the app runs inside another application, it must behave defensively. It should not assume ownership of the page, block CRM workflows, or modify SuiteCRM core behavior.

## Main Features

Planned and/or in-progress capabilities include:

- Open/close overlay shell
- Current route and module detection
- Dashboard-style summary panels
- Record list panels
- Record detail drill-down views
- Loading, empty, error, and success UI states
- Basic filtering, sorting, and searching
- Normalized CRM payload handling
- Permission-aware UI rendering
- Lead, account, case, or order prioritization logic
- Future controlled SuiteCRM actions through the Process API

## Project Scope

### In Scope

- Frontend overlay development
- SuiteCRM route awareness
- Safe React mounting
- GraphQL-based data retrieval
- Read-only dashboard views
- Record summaries and drill-down views
- UI state management
- Payload normalization
- Permission-aware rendering
- Lightweight business-priority scoring

### Out of Scope

- Replacing SuiteCRM
- Rebuilding the CRM backend
- Bypassing SuiteCRM permissions
- Modifying SuiteCRM core files
- Running destructive actions automatically
- Building a full standalone CRM
- Heavy reporting or analytics in the initial version

## Suggested Project Structure

```txt
src/
  api/
    gqlClient.js
    queries/
    processes/

  components/
    shell/
    dashboard/
    records/
    feedback/

  crm/
    crmRoutes.js
    crmMountGuards.js
    crmFieldMaps.js

  data/
    normalizeRecord.js
    normalizeRecordList.js
    payloadGuards.js

  hooks/
    useCrmRouteChange.js
    useRecordList.js
    useRecordDetail.js
    useOverlayShell.js

  scoring/
    leadPriorityScore.js
    accountActivityScore.js
    caseUrgencyScore.js

  state/
    overlayReducer.js
    overlayInitialState.js
```

## Development Setup

Install dependencies from the userscript project workspace:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Then install the development userscript in Tampermonkey and load SuiteCRM in the browser.

A typical development workflow is:

1. Start the local userscript dev server.
2. Enable the Tampermonkey development userscript.
3. Log into SuiteCRM.
4. Refresh the SuiteCRM page.
5. Develop and test the overlay against the live CRM interface.

## SuiteCRM GraphQL Usage

The overlay uses SuiteCRM's GraphQL endpoint to retrieve CRM data.

Common query types include:

- `record` — fetch a single CRM record
- `recordList` — fetch a list of module records
- `moduleMetadata` — inspect module configuration
- `appMetadata` — inspect navigation and application metadata
- `systemConfigs` — inspect frontend/system configuration

The app should centralize GraphQL behavior in a reusable client rather than scattering raw `fetch` calls throughout components.

## Process API Usage

SuiteCRM backend actions can be triggered through the GraphQL `createProcess` mutation.

For this project, Process API usage should be added carefully and only when there is a clear user-facing action. Destructive or high-impact actions should require confirmation, clear messaging, and permission-aware safeguards.

The initial overlay should focus mainly on reading and displaying data before adding mutation-heavy workflows.

## Safety Considerations

Because this app is injected into SuiteCRM, it must follow strict frontend safety rules:

- Do not mount inside unintended iframes
- Do not create duplicate React roots
- Do not block native SuiteCRM navigation or controls
- Do not expose actions the user lacks permission to perform
- Do not store sensitive CRM data unnecessarily
- Do not trigger mutations passively on page load
- Do not assume all CRM payloads have the same shape
- Do not over-fetch data that is not needed for the current view

## Roadmap

Potential roadmap items:

- Stable overlay shell
- Route-aware module detection
- Dashboard home panel
- Record list panel
- Record detail panel
- GraphQL client wrapper
- Payload normalization utilities
- Lead priority scoring
- Account activity scoring
- Case urgency scoring
- Module-specific dashboard cards
- Permission-aware action buttons
- Controlled Process API actions
- Persistent UI preferences
- Improved visual polish and accessibility

## Development Philosophy

This project should remain focused on enhancement, not replacement.

The overlay should help users understand important CRM information faster while preserving SuiteCRM as the system of record. Every feature should be evaluated based on whether it improves the user's workflow without adding unnecessary friction, visual clutter, or technical risk.

## License

Add license information here.
