# 🧠 AI-Powered Avatar Chatbot (TTS-Enabled)

A real-time text-to-speech (TTS) powered chatbot system using **Coqui TTS**, **FastAPI**, and **Yarn-based frontend**, structured across three main folders:
* `virtual-frontend-main` – UI/UX interface
* `virtual-backend-main` – Central backend server
* `coqui-tts-server` – FastAPI-powered speech synthesis server (Coqui TTS)
---
## 📁 Project Folder Structure
```bash
project-root/
├── virtual-frontend-main/    # Frontend (Yarn, React or static)
├── virtual-backend-main/     # Central logic/API server
├── coqui-tts-server/         # Coqui TTS + FastAPI server
└── README.md
```
---

## ⚙️ 1. Setup: `coqui-tts-server/` – Text-to-Speech Engine
This folder contains the **FastAPI-based TTS server using Coqui TTS**.
### 🧾 Requirements
* Python 3.8 or above
* FFmpeg installed and added to PATH
### 🔧 Setup Steps
```bash
cd coqui-tts-server
```
#### ✅ Step 1: Create and Activate Virtual Environment
```bash
python -m venv coqui_env
coqui_env\Scripts\activate
```
#### ✅ Step 2: Fix PowerShell Script Execution (One-time setup)
If you get an error running `activate.ps1`, run PowerShell as Administrator and:
```powershell
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned
```
> This enables local script execution (like activate.ps1). Safer than `Unrestricted`.
#### ✅ Step 3: Install Dependencies
```bash
pip install --upgrade pip setuptools wheel
pip install TTS
pip install fastapi uvicorn pydub ffmpeg-python
```
#### ✅ Step 4: Run the TTS Server
```bash
python tts_server.py
```
> The API will run at: `http://localhost:5005/tts`
---

## 🧠 2. Setup: `virtual-backend-main/` – Backend Integration Server
This folder contains the backend that connects frontend input to the Coqui TTS server.
### 🧾 Requirements
* Node.js (18+ recommended)
* Yarn (Node package manager)
### 🔧 Setup Steps
```bash
cd virtual-backend-main
```
#### ✅ Step 1: Install Yarn (if not already)
```bash
npm install -g yarn
```
Verify:
```bash
yarn --version
```
#### ✅ Step 2: Install Backend Dependencies
```bash
yarn install
```
#### ✅ Step 3: Start Backend Server
```bash
yarn dev
```
> Make sure this server can communicate with your Coqui TTS server on `localhost:5005`
---

## 💻 3. Setup: `virtual-frontend-main/` – Frontend Interface
This folder holds the user interface for interacting with the TTS system.
### 🧾 Requirements
* Node.js & Yarn
* Browser (Chrome recommended)
### 🔧 Setup Steps
```bash
cd virtual-frontend-main
```
#### ✅ Step 1: Install Frontend Dependencies
```bash
yarn install
```
#### ✅ Step 2: Start Frontend Development Server
```bash
yarn dev
```
> Usually available at `http://localhost:3000`
---
## 🧪 Test the Full Stack Locally
1. ✅ Start `coqui-tts-server` → `http://localhost:5005/tts`
2. ✅ Start `virtual-backend-main`
3. ✅ Start `virtual-frontend-main` → Visit `http://localhost:3000`
4. 💬 Enter text and click "Speak" → You’ll hear AI-generated speech using Coqui TTS.
---

## 📦 External Tools
* **FFmpeg** – Required for audio file processing
  Download: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
  Add the `/bin` folder to your system PATH and test with `ffmpeg -version`
---
