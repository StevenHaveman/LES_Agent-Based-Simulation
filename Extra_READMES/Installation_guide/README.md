# Installation Guide: Python & Node.js Application

**Set up your local application**  
**Author:** TEAM INNO 625
**Date:** June 2025

---

## Table of Contents

1. [Introduction](#1-introduction)  
2. [Prerequisites](#2-prerequisites)  
3. [Get the Application](#3-get-the-application)  
   - [3.1 Clone the Repository](#31-clone-the-repository)  
   - [3.2 Get the ZIP Folder](#32-get-the-zip-folder)  
4. [Set Up Python Environment](#4-set-up-python-environment)  
   - [4.1 Install Dependencies](#41-install-dependencies)  
   - [4.2 Use Virtual Environment (Optional)](#42-use-virtual-environment-optional)  
5. [Set Up Node.js Environment](#5-set-up-nodejs-environment)  
   - [5.1 Install Node Packages](#51-install-node-packages)  
   - [5.2 Start Frontend](#52-start-frontend)  
6. [Run the Application](#6-run-the-application)  
7. [Verify Installation](#7-verify-installation)  
8. [Troubleshooting](#8-troubleshooting)  

---

## 1. Introduction

This guide helps you set up a local environment for a Python and Node.js application.

It is intended for developers, testers, and students with basic command-line knowledge.

Ensure all prerequisites are installed before starting.

---

## 2. Prerequisites

Download and install the following tools:

| Tool     | Version | Download Link                           |
|----------|---------|------------------------------------------|
| Python   | 3.12+   | [python.org](https://www.python.org/downloads/) |
| Node.js  | LTS     | [nodejs.org](https://nodejs.org/) |
| Git      | Any     | [git-scm.com](https://git-scm.com/downloads) |
| Ollama   | Needed  | [ollama.com](https://ollama.com/) |

Some times your IDE like pycharm,visuael studio code have github build in and could be easier to use sometimes.

---

## 3. Get the Application

You can obtain the application in two ways:

### 3.1 Clone the Repository

```bash
git clone https://github.com/INNO-2025-Groep-625.git
cd INNO-2025-Groep-625
```

### 3.2 Get the ZIP Folder
Request a ZIP folder from the project owner, and unzip it on your local machine.

---

## 4. Set Up Python Environment
### 4.1 Install Dependencies
If you're using pip:
```
pip install -r requirements.txt
```
Or with Conda:
```
conda install --file requirements.txt
```

### 4.2 Use Virtual Environment (Optional)
Using Anaconda (recommended if working with multiple projects):

1. Download [Anaconda](https://www.anaconda.com/download).

2. Open the Anaconda Prompt

3. Run the following:

```
conda create --name myenv python=3.12
conda activate myenv <<< Can be whatever name you want ofcourse.
```

---

## 5. Set Up Node.js Environment

### 5.1 Install Node Packages
Navigate to the frontend directory:
```
cd frontend
npm install
```

This will install all frontend dependencies from ```package.json.```

### 5.2 Start Frontend
To launch the frontend:
```
npm run dev
```

Make sure you're in the frontend folder before running the command.

If not, navigate using:
```
cd frontend
```

---

## 6. Run the Application
Open two terminal windows or tabs.
**Backend:**
```
python backend/abm/app.py
```
**Frontend:**
```
cd frontend
npm run dev
```

---

## 7. Verify Installation
Open your browser and go to:

**Frontend:** http://localhost:5173/INNO/

**Backend:** http://127.0.0.1:5000

If you see the simulation running and data/graphs are shown, everything is working correctly.

---

## 8. Troubleshooting

| Issue                         | Cause                                  | Solution                                                                 |
|------------------------------|----------------------------------------|--------------------------------------------------------------------------|
| `python` not recognized       | Python not added to PATH               | Add Python to your system’s PATH during installation or manually later. |
| `pip` command not found       | Pip not installed or PATH issue        | Reinstall Python and ensure pip is included and on PATH.                |
| `npm` install errors          | Missing or broken packages             | Delete `node_modules` and `package-lock.json`, then run `npm install`.  |
| `Permission denied` errors    | Insufficient permissions               | Use `sudo` (Linux/Mac) or run as Administrator (Windows).               |
| Port already in use           | Other process using port 5173 or 5000  | Stop the process or change the port in config.                          |
| Backend doesn't start         | Missing Python packages or typo        | Check your virtual environment and reinstall requirements.              |
| Frontend doesn’t load         | Build issues or missing packages       | Run `npm install` again, or check `vite.config.js` and `main.jsx`.      |
