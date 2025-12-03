# 🚀 ACM Weekly Coding Challenge Platform

Welcome to the official platform for the **ACM Student Chapter Weekly Coding Challenges**! This website is designed to help students improve their coding skills, compete with peers, and earn recognition through badges and a global leaderboard.

## 🌟 What is this?

Think of this as a mini-LeetCode or HackerRank built specifically for our college community.
- **Students** can solve weekly problems, track their progress, and show off their badges.
- **Admins** can post new challenges, manage users, and award points.

---

## 🛠️ Tech Stack (What we used to build it)

We used modern, industry-standard tools. Here's a simple breakdown:

### **Frontend (The part you see)**
- **[Next.js](https://nextjs.org/)**: A powerful framework built on top of React. It makes building websites fast and easy.
- **[TypeScript](https://www.typescriptlang.org/)**: JavaScript with superpowers (types). It helps catch errors before they happen.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework. Instead of writing separate CSS files, we use classes like `text-center` or `bg-blue-500` directly in our HTML.
- **[Shadcn UI](https://ui.shadcn.com/)**: A collection of beautiful, reusable components (like buttons, cards, and inputs) so we don't have to build them from scratch.

### **Backend (The brain behind the scenes)**
- **[Node.js](https://nodejs.org/)**: Allows us to run JavaScript on the server (outside the browser).
- **[Express.js](https://expressjs.com/)**: A web framework for Node.js. It handles API requests (like "get me all challenges" or "log this user in").
- **[MongoDB](https://www.mongodb.com/)**: A NoSQL database. It stores all our data (users, challenges, badges) in JSON-like documents.
- **[Mongoose](https://mongoosejs.com/)**: A tool that helps our Node.js backend talk to the MongoDB database easily.

### **Authentication (Security)**
- **JWT (JSON Web Tokens)**: A secure way to keep users logged in. When you log in, the server gives you a "token" (like a digital ID card) that you show with every request.

---

## ✨ Features

### **For Users**
- **🔐 Secure Login/Register**: Sign up with your college email (`@stu.xim.edu.in`). Includes a "Forget Password" link to contact support.
- **🏆 Leaderboard**: See who has the most points and highest streaks.
- **🧩 Weekly Challenges**: Access the current active challenge and see upcoming ones.
- **🎖️ Badges**: Earn cool badges for achievements (e.g., "First Win", "Streak Master").
- **👤 Profile**: View your rank, points, and earned badges.

### **For Admins & Owners**
- **⚙️ Dashboard**: A special panel to manage the whole platform.
- **👑 Owner Role**: Full access to everything, including deleting users and managing other admins.
- **🛡️ Admin Role**: Can create challenges and manage points but cannot delete users or modify sensitive info.
- **➕ Create Challenges**: Post new problems with descriptions, test cases, and points.
- **👥 Manage Users**: Update user points and assign badges.
- **🏷️ System Admin Badge**: Admins appear on the leaderboard with a special "System Admin" badge instead of a rank.

---

## 🚀 Getting Started (Run it on your laptop)

Follow these steps to get the project running locally:

### **1. Prerequisites**
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [Git](https://git-scm.com/)

### **2. Clone the Repository**
Download the code to your computer:
```bash
git clone <your-repo-url>
cd acm-weekly-coding-challenge-platform
```

### **3. Setup the Backend**
The backend needs to connect to the database.
1.  Go to the backend folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your secrets (ask an admin for these):
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    PORT=5000
    ```
4.  Start the server: `node server.js`
    *(It should say "Server is running on port 5000" and "MongoDB connected")*

### **4. Setup the Frontend**
Open a **new terminal** window (keep the backend running!).
1.  Go to the main folder: `cd ..` (if you are in backend)
2.  Install dependencies: `npm install`
3.  Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```
4.  Start the website: `npm run dev`
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

- **`/app`**: Contains all the pages (Home, Login, Challenges, etc.). Next.js uses this folder to automatically create routes.
- **`/components`**: Reusable UI parts like the Header, Footer, and Cards.
- **`/backend`**: All the server-side code.
    - **`/models`**: Defines how data looks in the database (User, Challenge, Badge).
    - **`/routes`**: Defines the API endpoints (API URLs).
- **`/context`**: Handles global state like "Is the user logged in?".

---

## ☁️ Deployment

- **Frontend**: Hosted on [Vercel](https://vercel.com).
- **Backend**: Hosted on [Render](https://render.com).

See `DEPLOYMENT.md` for detailed deployment instructions.

---

Made with ❤️ by the ACM Student Chapter.