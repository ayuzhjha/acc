# Deployment Guide

This guide will walk you through deploying your ACM Weekly Coding Challenge Platform.

## Prerequisites

1.  **GitHub Account**: Ensure your code is pushed to a GitHub repository.
2.  **Render Account**: For hosting the backend (Node.js/Express).
3.  **Vercel Account**: For hosting the frontend (Next.js).
4.  **MongoDB Atlas**: You already have this set up.

---

## Part 0: Repository Setup (One Repo for Both)

You can upload the **entire folder** to a single GitHub repository. This is the easiest way.

*   **Frontend (Vercel)**: Will use the main folder (root).
*   **Backend (Render)**: Will use the `backend` subfolder.

You do **not** need separate repositories.

---

## Part 1: Deploy Backend to Render

1.  **Log in to [Render](https://render.com/)**.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  **Configure the Service**:
    *   **Name**: `acm-backend` (or similar)
    *   **Root Directory**: `backend` (Important! Your server code is in this folder)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables**:
    Scroll down to "Environment Variables" and add:
    *   `MONGODB_URI`: Your MongoDB connection string (from your `.env` file).
    *   `JWT_SECRET`: A secure random string (e.g., `mysecretkey123`).
    *   `PORT`: `10000` (Render usually sets this automatically, but good to have).
6.  Click **Create Web Service**.
7.  **Wait for Deployment**: It will take a few minutes. Once done, copy the **onrender.com URL** (e.g., `https://acm-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel

1.  **Log in to [Vercel](https://vercel.com/)**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure the Project**:
    *   **Framework Preset**: Next.js (should be detected automatically).
    *   **Root Directory**: `.` (default is fine, or select the root if asked).
5.  **Environment Variables**:
    Expand the "Environment Variables" section and add:
    *   `NEXT_PUBLIC_API_URL`: The **Render Backend URL** you copied in Part 1 (e.g., `https://acm-backend.onrender.com`). **Do not add a trailing slash.**
6.  Click **Deploy**.
7.  **Wait for Deployment**: Vercel will build your site. Once done, you will get a live URL (e.g., `https://acm-challenge.vercel.app`).

---

## Part 3: Final Configuration

1.  **Update Backend CORS (Optional but Recommended)**:
    *   Once your frontend is live, you might want to restrict the backend to only allow requests from your Vercel domain.
    *   In `backend/server.js`, update `app.use(cors())` to `app.use(cors({ origin: 'https://your-vercel-app.vercel.app' }));`.
    *   Push the change to GitHub, and Render will auto-deploy.

## Troubleshooting

*   **Backend Error**: Check the "Logs" tab in Render.
*   **Frontend Error**: Check the "Logs" tab in Vercel.
*   **Connection Error**: Ensure `NEXT_PUBLIC_API_URL` in Vercel matches your Render URL exactly.
