# 🚀 Smart URL Shortener with Analytics

A professional, high-performance URL shortener built with **Python (Flask)** or **Node.js (Express)**, featuring real-time analytics, QR codes, and a sleek modern dashboard.

![Smart URL Shortener Dashboard](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/link.svg)

## ✨ Features

- **🔗 Instant Shortening**: Generate unique, secure short codes (Base62) for any URL.
- **📊 Live Analytics**: Track clicks and last-activity timestamps in real-time.
- **📲 QR Code Integration**: Automatic QR code generation for every short link.
- **⏰ Custom Expiry**: Choose link lifespan (7 days, 30 days, 90 days, or 1 year).
- **📋 One-Click Copy**: Easily copy short links to your clipboard.
- **🛡️ Secure & Fast**: Built-in rate limiting, security headers, and compression.
- **💾 Zero Configuration**: Uses SQLite for seamless setup (no external DB required).

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python 3.x (Flask) **OR** Node.js (Express) |
| **Frontend** | HTML5, Tailwind CSS, JavaScript |
| **Database** | SQLite3 |
| **Utilities** | QRCode.js, HTMX (optional support) |

---

## 🚀 Quick Start (Choose Your Flavor)

### Option A: Python (Flask)
Best for rapid development and Python environments.

1. **Enter the directory**:
   ```bash
   cd url-shortener
   ```
2. **Setup environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # OR
   .\venv\Scripts\activate   # Windows
   ```
3. **Install & Run**:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
4. **Visit**: `http://localhost:5000`

### Option B: Node.js (Express)
Best for production-ready performance.

1. **Enter the directory**:
   ```bash
   cd url-shortener
   ```
2. **Install & Run**:
   ```bash
   npm install
   npm start
   ```
3. **Visit**: `http://localhost:3000`

---

## 📁 Project Structure

```text
.
├── app.py              # Flask Backend
├── server.js           # Node.js Backend
├── package.json        # Node Dependencies
├── requirements.txt    # Python Dependencies
├── public/             # Frontend Assets
│   ├── index.html      # Main Dashboard
│   ├── script.js       # Client Logic (QR/Analytics)
│   └── style.css       # Custom Styles
├── db/                 # Database Storage (Auto-created)
└── README.md           # This file
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/shorten` | Create a new short link |
| `GET` | `/api/links` | Retrieve all active links and stats |
| `GET` | `/:short_code` | Redirect to original URL + Track click |

---

## 🚢 Deployment

### Render.com (Recommended)
1. Push this repository to GitHub.
2. Create a new **Web Service** on Render.
3. Use the following settings:
   - **Build Command**: `npm install` (for Node) or `pip install -r requirements.txt` (for Python)
   - **Start Command**: `npm start` or `gunicorn app:app`
4. Render's persistent disk will handle the SQLite database automatically!

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License
This project is licensed under the MIT License.
