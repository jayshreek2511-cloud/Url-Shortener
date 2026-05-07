# 🚀 Smart URL Shortener with Analytics

A professional, high-performance URL shortener built with **Python (Flask)** and **Node.js (Express)**, featuring real-time analytics, QR codes, and a sleek modern dashboard with glassmorphism aesthetics.

---

## 🌟 Overview
This project is a full-stack URL shortening service designed for speed, security, and ease of use. It provides users with shortened links that are easy to share, while giving creators powerful analytics to track engagement. 

The project includes **two backend implementations** (Python/Flask and Node.js/Express) so you can choose the one that fits your environment best.

---

## ✨ Key Features

### 🔗 Link Management
- **Instant Generation**: Create secure, 6-character unique codes using Base62 encoding.
- **Custom Expiry**: Set links to expire in 7, 30, 90, or 365 days to manage data privacy.
- **Validation**: Built-in URL validation to prevent broken links.

### 📊 Powerful Analytics
- **Click Tracking**: Real-time counters for every link.
- **Activity Monitoring**: Tracks "Created At" and "Last Clicked" timestamps.
- **Dashboard**: A sleek, responsive management panel to view all active links at once.

### 📲 Engagement Tools
- **Auto QR Codes**: Every link automatically generates a high-quality QR code for mobile sharing.
- **One-Click Copy**: Built-in clipboard integration for seamless sharing.
- **Live Updates**: Dashboard updates dynamically using asynchronous API calls.

### 🛡️ Security & Performance
- **Rate Limiting**: Protects your API from abuse and brute-force attacks.
- **Security Headers**: Uses `Helmet` (Node) and standard security practices to prevent XSS and Clickjacking.
- **Data Persistence**: Uses a lightweight SQLite database that requires zero configuration.

---

## 🛠️ Technology Stack

### Backend Options
| Tech | Description |
| :--- | :--- |
| **Python / Flask** | Lightweight and flexible REST API. Uses `Flask-CORS` for cross-origin support. |
| **Node.js / Express** | High-performance, asynchronous server. Uses `Express-Rate-Limit` and `Helmet`. |

### Frontend & Database
| Tech | Description |
| :--- | :--- |
| **Tailwind CSS** | Modern utility-first CSS framework for a premium UI. |
| **SQLite3** | File-based database for zero-setup persistence. |
| **HTMX** | (Optional support) for server-side HTML partials. |
| **QRCode.js** | Client-side QR code generation. |

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+ **OR** Node.js 16+
- Git

### 1. Clone & Navigate
```bash
git clone <your-repo-url>
cd url-shortener
```

### 2. Setup (Python Version)
```bash
# Create Virtual Environment
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# Install Dependencies
pip install -r requirements.txt

# Run
python app.py
```
*App will be available at:* `http://localhost:5000`

### 3. Setup (Node.js Version)
```bash
# Install Dependencies
npm install

# Run
npm start
```
*App will be available at:* `http://localhost:3000`

---

## 📋 API Documentation

### Shorten a URL
`POST /api/shorten`
- **Body**: `{ "url": "https://example.com", "expiresInDays": 7 }`
- **Response**: `{ "short_url": "...", "short_code": "...", "original_url": "...", "expires_at": "..." }`

### List All Links
`GET /api/links`
- **Response**: A JSON array of all active short links and their metrics.

### Link Redirection
`GET /:short_code`
- Redirects to the original URL and increments the click counter.

---

## 💾 Database Schema (SQLite)

The `db/urls.db` file contains a table named `urls` with the following structure:

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER | Primary Key (Autoincrement) |
| `original_url` | TEXT | The destination URL |
| `short_code` | TEXT | Unique 6-character code |
| `clicks` | INTEGER | Total redirect count |
| `created_at` | DATETIME | Time of creation |
| `expires_at` | DATETIME | Expiry timestamp |
| `last_clicked`| DATETIME | Most recent click time |

---

## 🛠️ Troubleshooting

- **"Network Error" or Connection Failures**: 
  - Ensure you are using the correct port (`5000` for Python, `3000` for Node).
  - Check if the server process is still running in your terminal.
- **Database Locked**:
  - Close any other applications (like DB Browser) that might be accessing `db/urls.db`.
- **Styling Issues**:
  - Ensure you have an internet connection to load Tailwind CSS and Google Fonts via CDN.

---

## 🚢 Deployment (Free Hosting)

### Render.com (Recommended)
1. Push your code to GitHub.
2. Select "Web Service" on Render.
3. For Python: Build `pip install -r requirements.txt`, Start `gunicorn app:app`.
4. For Node: Build `npm install`, Start `npm start`.
5. **Important**: Add a "Disk" mount to `/app/db` if you want the database to persist between deployments.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Created with ❤️ by Antigravity**
