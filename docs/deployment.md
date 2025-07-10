# 🚀 Deployment Guide

**Project Stack:** Python (Flask) + Node.js (Vite/React) + Ollama (AI chat)  
**Deployment Example:** Render.com  
**Date:** June 2025

---

## 📚 Table of Contents

1. [Introduction](#1-introduction)
2. [Deployment Provider Choice](#2-deployment-provider-choice)
3. [Deploying the Backend (Flask API)](#3-deploying-the-backend-flask-api)
4. [Backend Resource Limits](#4-backend-resource-limits)
5. [Deploying the Frontend](#5-deploying-the-frontend)

---

## 1. Introduction

This section explains how to deploy the application online so that anyone can use it without technical knowledge or an
IDE. Both the backend and frontend need to be deployed and hosted. The backend is deployed
using [Render.com](https://render.com/), while the frontend is deployed using [GitHub Pages](https://pages.github.com/)
for its ease of use and the team's prior experience.

---

## 2. Deployment Provider Choice

We chose Render.com for backend deployment and GitHub Pages for frontend deployment, based on team experience and
convenience. No extensive comparison was made between providers. This setup is an example and not a final
recommendation. Future teams are encouraged to research the best deployment solution for the needs of the Product Owner.

---

## 3. Deploying the Backend (Flask API)

The backend (Flask API) is hosted on Render.com.

### 3.1 Automatic Deployment

- Render can automatically deploy the backend after each commit to a specific branch.
- This can be configured in the Render dashboard.

### 3.2 Manual Deployment

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in.(inlog detials need to be shared)
2. Select the backend server from your services.
3. Click the **Manual Deploy** button in the top right to trigger a manual deployment.

![Render Manual Deploy Screenshot](https://github.com/user-attachments/assets/4864a9b8-7535-45e5-9b55-99ec1725ce6d)

---

## 4. Backend Resource Limits

### 4.1 RAM Usage Limits

The backend simulation is memory-intensive. On the free Render plan (512 MB RAM), the following simulation limits apply:

- `nr_households`: 10
- `nr_residents`: 20
- `simulation_years`: 10

For larger or real-world simulations, upgrade to a paid plan with more memory.

---

### 4.2 HouseholdMap bug

Currently, the household map does not load immediately when a new simulation starts. You need to refresh the page to see the updated map.

---

## 5. Deploying the Frontend

The frontend is deployed using [GitHub Pages](https://pages.github.com/) for convenience and team experience. Deployment is automated via the `gh-pages` branch.

### 5.1 Build the Frontend

From the `frontend` directory, run:

```bash
  npm run build
```

This creates a production-ready build in the dist folder.


### 5.2 Deploy to GitHub Pages
To publish the build to GitHub Pages, run 


```bash
  npm run deploy
```

This command pushes the contents of the dist folder to the gh-pages branch of your repository, making the site available at:

https://StevenHaveman.github.io/LES_Agent-Based-Simulation/

Make sure the homepage field in your package.json is set correctly for your repository.

### 5.3 Notes
- The deployment uses the gh-pages npm package.
- Any changes to the frontend require a new build and deploy.
- The site is automatically served from the gh-pages branch by GitHub Pages.

---
