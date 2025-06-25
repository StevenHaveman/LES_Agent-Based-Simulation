# 🚀 Installation & Quick Start Guide

**Project Stack:** Python (Flask) + Node.js (Vite/React) + Ollama (AI chat)  
**Author:** TEAM INNO 625  
**Date:** June 2025  

---

## 📚 Table of Contents

1. [Introduction](#1-introduction)  
2. [Prerequisites](#2-prerequisites)  
3. [Get the Project](#3-get-the-project)  
4. [Set Up Python (Flask API)](#4-set-up-python-flask-api)  
5. [Set Up Node.js (Frontend)](#5-set-up-nodejs-frontend)  
6. [Configure AI Chat with Ollama](#6-configure-ai-chat-with-ollama)  
7. [Run the Application](#7-run-the-application)  
8. [Verify Installation](#8-verify-installation)  
9. [Troubleshooting](#9-troubleshooting)  

---

## 1. Introduction

This guide walks you through setting up the application locally. It consists of:

- A **Flask API (Python)** for the backend  
- A **React/Vite (Node.js)** frontend  
- An **Ollama-powered AI chat** feature  

Perfect for developers, testers, or students working on the project.

All things should be able to be either downloaded or installed trough the command prompt for example
```
pip install requirments.txt
or
npm install
```
![Alt text](photos/CMD%20prompt.png)
---

## 2. Prerequisites

Make sure the following tools are installed:

| Tool     | Version | Download Link |
|----------|---------|----------------|
| Python   | 3.12+   | [python.org](https://www.python.org/downloads/) |
| Node.js  | LTS     | [nodejs.org](https://nodejs.org/) |
| Git      | Any     | [git-scm.com](https://git-scm.com/downloads) |
| Ollama   | Required | [ollama.com](https://ollama.com/) |

> 💡 Tip: IDEs like VS Code or PyCharm have built-in Git support and may simplify the process.

---

## 3. Get the Project

You can obtain the code in two ways:

### 3.1 Clone the Repository
```bash
git clone https://github.com/INNO-2025-Groep-625.git
cd INNO-2025-Groep-625
```

### 3.2 Download ZIP
Ask the project owner for a ZIP file and extract it locally.

## 4. Set Up Python (Flask API)
### 4.1 Install Python Dependencies
Using pip:
```
pip install -r requirements.txt
```
Or using Conda:
```
conda install --file requirements.txt
```
### 4.2 (Optional) Use Virtual Environment
Recommended for working on multiple Python projects.
myenv: Can be whatever name you need it to be.
```
conda create --name myenv python=3.12
conda activate myenv
```

## 5. Set Up Node.js (Frontend)
### 5.1 Install Node Dependencies
From the root folder:
```
cd frontend
npm install
```
This installs all required packages defined in package.json.

### 5.2 Start the Frontend
To launch the UI:
```
npm run dev
```
Make sure you are in the frontend folder before running this command.

## 6. Configure AI Chat with Ollama
1. Download Ollama
Visit: https://ollama.com/download
Choose your operating system.

2. Install Ollama
Run the downloaded installer.

3. Verify Installation
```
ollama --version
```
4. Start the Ollama Server
```
ollama serve
```
5. Download the model
In a new terminal:
```
ollama pull llama3.1:8b
```
6. Run the model
In a new terminal:
```
ollama run llama3.1:8b
```
If there are no error's show you know the model is installed and will run. In this case close the terminals and the model wil beloaded in inside the back-end of the application.

## 7. Run the Application
Open two terminal windows or tabs:
Make sure you are in the correct project path
```
INNO-2025-Groep-625>
```
Terminal 1: Start the Flask API
```
python backend/abm/app.py
```
Terminal 2: Start the Frontend
```
cd frontend
npm run dev
```
folderpath should look like this.
```
INNO-2025-Groep-625/frontend> npm run dev
```

## 8. Verify Installation
Open your browser:
- Frontend UI: http://localhost:5173/INNO/
- Backend API: http://127.0.0.1:5000

If the simulation runs and graphs are visible, you're good to go! 🎉


## 9. Troubleshooting

| Problem                      | Likely Cause                          | Solution                                                             |
|-----------------------------|----------------------------------------|----------------------------------------------------------------------|
| `python` not recognized     | Not added to PATH                      | Add Python to PATH during install or update system environment vars |
| `pip` not found             | Not installed or not on PATH           | Reinstall Python with pip option                                     |
| `npm install` fails         | Broken or missing packages             | Delete `node_modules` and `package-lock.json`, then retry install    |
| Permission denied           | Insufficient privileges                | Run as admin or use `sudo`                                           |
| Port 5173 or 5000 in use    | Already occupied by other processes    | Kill the process or change port settings                             |
| Frontend not working        | Build errors or Vite misconfig         | Rerun `npm install`, check `vite.config.js` and entry points         |
| AI chat not working         | Ollama not running or model missing    | Make sure the model is downloaded And that your system has adleast 5-6gb free     |


