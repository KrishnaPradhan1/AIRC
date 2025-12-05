# Deployment Guide

This guide explains how to deploy the **AIRC** application to a live environment. We recommend using **Render** for the backend (Python/Flask) and **Vercel** for the frontend (Next.js).

## 1. Backend Deployment (Render)

1.  Create an account on [Render](https://render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository: `KrishnaPradhan1/AIRC-Resume_classifier_-_analyzer_job_portal`.
4.  Render will auto-detect the settings, but ensure:
    *   **Root Directory:** `backend`
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `gunicorn run:flask_app` (This is already set in the `Procfile`)
5.  **Environment Variables:** Add the following:
    *   `GEMINI_API_KEY`: Your Google Gemini API Key.
    *   `SECRET_KEY`: A random string for security.
    *   `PYTHON_VERSION`: `3.9.0` (Recommended)
6.  Click **"Create Web Service"**.
7.  Once deployed, copy the **Service URL** (e.g., `https://airc-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  Create an account on [Vercel](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the same GitHub repository.
4.  Configure the project:
    *   **Root Directory:** `frontend` (Click "Edit" next to Root Directory)
    *   **Framework Preset:** `Next.js` (Auto-detected)
5.  **Environment Variables:**
    *   `NEXT_PUBLIC_API_URL`: The Backend URL from Render (e.g., `https://airc-backend.onrender.com/api`) **IMPORTANT:** Add `/api` at the end.
6.  Click **"Deploy"**.

## 3. Final Verification

1.  Open your deployed Vercel URL.
2.  Try logging in or posting a job.
3.  The frontend should communicate with the backend on Render.
