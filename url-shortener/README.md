# 🚀 SmartLink - High-Performance URL Shortener & Analytics

A professional, high-fidelity **MERN Stack** (MongoDB, Express, React, Node.js) URL Shortener featuring a stunning glassmorphic dashboard, real-time analytics graphs, device breakdown matrices, custom backhalf keys, and automated QR code integrations.

---

## ✨ Features

- **🔗 Instant Shortening**: Generate unique, secure shortened links instantly.
- **✨ Custom Short Codes**: Claim customized aliases (e.g. `smart.lnk/promo2026`) for targeted campaigns.
- **📊 Real-Time Network Analytics**: View cumulative link metrics (total links, network-wide traffic spikes over time) directly on the landing screen.
- **📈 Advanced Reporting Dashboard**: Click on any shortened link to view an overlay displaying:
  - *Click Timeline History* (Area Chart of clicks per day).
  - *Browser Breakdown* (Horizontal Bar Chart).
  - *Device OS Breakdown* (Donut Chart).
  - *Referrer Distribution* (Distribution progress-bars representing search engine/social traffic vs direct visits).
- **📋 Copier & Tooltips**: Modern clipboard actions with responsive UI notifications.
- **📲 Live QR Code Previews**: Automated high-contrast QR codes rendered instantly on demand.
- **⏰ Custom Expiry lifespans**: Manage lifespan durations (7 days, 30 days, 90 days, or 1 year) to restrict link access.
- **🌗 Complete Dark/Light Mode**: Toggle gorgeous custom HSL variables on the fly.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Recharts, Lucide React | Modern SPA with custom HSL design system |
| **Backend** | Node.js, Express.js | High-performance RESTful API endpoints |
| **Database** | MongoDB, Mongoose | Scalable, document-based NoSQL storage |
| **Utilities** | Helmet, Compression, Express Rate-Limit | Secure production-ready configurations |

---

## 📁 Repository Map

```text
url-shortener/
├── server.js               # Express Backend (Handles MongoDB connection, REST APIs & routing)
├── package.json            # Backend Node packages & dev runner
├── .env                    # Environment variables config
└── client/                 # React Frontend (Scaffolded with Vite)
    ├── index.html          # SEO-Optimized template
    ├── src/
    │   ├── App.jsx         # App shell and state driver
    │   ├── index.css       # HSL theme system, animations & glassmorphism
    │   └── components/     # High-fidelity dashboard widgets & detail overlays
    │       ├── Dashboard.jsx
    │       ├── ShortenForm.jsx
    │       ├── LinksList.jsx
    │       ├── LinkDetailsModal.jsx
    │       └── ThemeToggle.jsx
    └── vite.config.js      # Dev server API proxying
```

---

## 🚀 Quick Start Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and a **MongoDB** instance running locally (`mongodb://127.0.0.1:27017/url_shortener`) or a remote MongoDB Atlas URI.

### 2. Environment Setup
Create a `.env` file in the root `url-shortener/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/url_shortener
```

### 3. Run Development Server
We support concurrent running. For development, you can start the backend API server and the front-end Vite client.

**Start the Backend (API Server):**
```bash
# In the url-shortener root directory
npm install
npm run dev
# Server runs on http://localhost:5000
```

**Start the React Frontend (Vite):**
```bash
# In the url-shortener/client directory
cd client
npm install
npm run dev
# Client runs on http://localhost:5173 (proxies /api requests automatically to :5000)
```

### 4. Build for Production
To build the static frontend files and run the server serving them as a unified package:
```bash
# In url-shortener/client
npm run build

# In url-shortener root
npm start
# Unified application running on http://localhost:5000!
```

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/shorten` | Shortens destination URL. Takes `{ url, expiresInDays, customCode }` |
| `GET` | `/api/links` | Fetches active/non-expired URLs |
| `GET` | `/api/links/:shortCode/analytics` | Retrieves click histories, OS breakdowns, & referrer distribution logs |
| `DELETE` | `/api/links/:id` | Deletes a link document |
| `GET` | `/:shortCode` | Capture click analytics metadata (Browser, Referrer, OS) and redirect |
