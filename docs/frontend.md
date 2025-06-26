# Frontend


## Table of Contents

- [Project Structure & File Descriptions](#1-project-structure--file-descriptions)
- [Architecture Flowchart](#2-architecture-flowchart)
- [Components](#3-components)

## 1. Project Structure & File Descriptions

This frontend is a React-based web application designed to visualize and control the agent-based sustainability
simulation. It follows an MVC-inspired architecture, separating concerns between data services, controllers, views, and
reusable UI components.

```
frontend/
├── public/            # Static assets (index.html, favicon, etc.)
├── src/
│   ├── components/    # Reusable UI components (AI-chat, Graphs , etc.)
│   ├── pages/         # Main application pages (Config, Overview)
│   ├── services/      # API service modules for backend communication with Flask API
│   ├── styles/        # CSS files for styling components and pages
│   ├── controllers/   # Controller logic connecting UI and services
│   ├── App.jsx        # Main application entry point
│   ├── root.jsx       # Central routing configuration
│   └── index.js       # React DOM bootstrap
├── package.json       # Project metadata and dependencies
├── vite.config.js     # Vite build configuration
└── README.md          # Project documentation
```


## 2. Architecture Flowchart
<img width="758" alt="Scherm­afbeelding 2025-06-24 om 22 52 07" src="https://github.com/user-attachments/assets/5ac96f8c-2916-455e-b7e9-ecf5f86c292c" />

## 3. Components

| Component                | Description                                                                                                    |
|--------------------------|----------------------------------------------------------------------------------------------------------------|
| **AIChat.jsx**           | UI for sending messages to and receiving responses from the AI agent, enabling interactive simulation chat.     |
| **AIChatWindow.jsx**     | Displays the ongoing chat history with the AI, including message formatting and scrollable conversation view.   |
| **ConfigForm.jsx**       | Form for inputting and updating simulation parameters, with validation and submission features.                 |
| **ConfigNavbar.jsx**     | Navigation bar for the configuration section, allowing switching between config-related views or steps.         |
| **Graphic.jsx**          | Renders a single graph or chart for a specific aspect of simulation data, with dynamic updates and tooltips.    |
| **GraphicsView.jsx**     | Shows multiple simulation graphics, providing an overview of key metrics and trends in a dashboard layout.      |
| **HouseholdDecisions.jsx** | Displays decisions made by a household agent, allowing review, analysis, or interaction with choices.         |
| **HouseholdInfo.jsx**    | Presents detailed information about a selected household, including members, resources, and current state.      |
| **HouseholdMap.jsx**     | Visualizes the spatial distribution of households on a map, supporting selection and highlighting.              |
| **HouseholdNavbar.jsx**  | Navigation bar for household-related views, enabling quick access to household information and actions.         |
| **HouseholdWindow.jsx**  | Main container for displaying and managing all household-related data, combining info, decisions, and map views.|
| **KPIWindow.jsx**        | Displays key performance indicators (KPIs) like sustainability scores, resource usage, and progress metrics.    |
| **OverviewNavbar.jsx**   | Navigation bar for the main dashboard/overview, allowing switching between high-level simulation views.         |
| **ResidentDropdown.jsx** | Dropdown menu for selecting a resident within a household, used to filter or display resident-specific data.    |
| **ResidentInfo.jsx**     | Shows detailed information about a selected resident, including attributes, actions, and simulation status.     |
| **ResidentNavbar.jsx**   | Navigation bar for resident-related views, facilitating navigation between residents or resident data sections. |
| **ResidentWindow.jsx**   | Main container for managing and displaying resident-specific information, actions, and interactions.            |
| **SimulationParameters.jsx** | Displays and allows editing of current simulation parameters, supporting real-time updates and validation.   |