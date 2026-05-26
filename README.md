# 🚀 SmartLink - Complete MERN Stack URL Shortener 🔗

A high-performance, professional-grade URL Shortening service built using the **MERN Stack** 🍃 (MongoDB, Express, React, Node.js). Featuring a beautiful custom dark/light-themed glassmorphism dashboard 🎨, real-time analytics graphs 📈, device OS profiling 💻, and instant QR code generators 📱.

---

## ✨ Key Features

### 🔗 Link & Alias Management
- **Instant Generation ⚡**: Generate secure unique Base62 codes.
- **Custom Backhalf ✏️**: Claim unique, custom short codes (e.g. `smart.lnk/promo2026`).
- **Flexible Expiry ⏳**: Restrict link lifespans to 7, 30, 90, or 365 days.
- **Auto QR Code 🔳**: Instant QR code generation for mobile and printed sharing.

### 📊 Deep Analytics Dashboard
- **Cumulative Metrics Overview 📈**: Aggregated network stats (*Total Links*, *Total Click Actions*, *Active vs Expired*, and *Average Clicks per Link*) displayed inside dynamic KPI cards.
- **Spike Analysis Charting 📉**: Beautiful, responsive area charts representing network clicks traffic spikes over time.
- **Deep URL Analytics 🔍**: Expand any link to inspect:
  - Daily click timelines (Area Chart).
  - Browser user-agent distributions (Chrome, Safari, Edge, Firefox, etc.) 🌐.
  - Operating System device profiles (Windows, macOS, Android, iOS, Linux) 💻.
  - Referrer hostname distributions (Socials/Search Engines vs Direct visits) 🔗.
  - Raw sequential event clicks log 📝.

---

## 🛠️ Tools & Technology Stack 💻

| Category | Tool / Library | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) 🟢 | Server-side JavaScript runtime |
| **Frontend Framework** | React 19 ⚛️ | Component-based UI library |
| **Build Tool** | Vite 8 ⚡ | Fast development server & bundler |
| **Charting** | Recharts 3 📊 | Responsive analytics charts (Area, Bar, Pie) |
| **Icons** | Lucide React 🖼️ | Clean, modern SVG icon set |
| **Backend Framework** | Express.js 4 🚂 | RESTful API server |
| **Database** | MongoDB 🍃 | Document-based NoSQL database |
| **ODM** | Mongoose 9 🦦 | Schema-based MongoDB object modeling |
| **Dev DB Fallback** | mongodb-memory-server 🧠 | In-memory MongoDB for zero-config local dev |
| **Security** | Helmet 🪖 | HTTP security headers |
| **Performance** | Compression 🗜️ | Gzip response compression |
| **Rate Limiting** | express-rate-limit 🚦 | API abuse prevention (100 req / 15 min) |
| **CORS** | cors 🌍 | Cross-origin resource sharing |
| **Environment** | dotenv 🔐 | `.env` variable management |
| **Dev Server** | Nodemon 🔄 | Auto-restart on backend file changes |
| **Styling** | Vanilla CSS + CSS Variables 🎨 | Custom design system with soft lavender palette |
| **Font** | Inter (Google Fonts) 🔤 | Modern, clean typography |
| **QR Codes** | qrserver.com API 🔳 | Dynamic QR code generation via external API |

---

## 📁 Project Structure 📂

```
url-shortener/
├── .env                    # Environment variables
├── package.json            # Backend dependencies & scripts
│
├── server/                 # 🔧 Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js           # MongoDB connection + in-memory fallback
│   ├── models/
│   │   └── Url.js          # Mongoose schema (URL, clicks, analytics)
│   ├── routes/
│   │   └── urlRoutes.js    # REST API endpoints & redirect handler
│   ├── utils/
│   │   └── helpers.js      # URL validation, code gen, UA parsing
│   └── server.js           # Express entry point
│
├── client/                 # 🎨 Frontend (React + Vite)
│   ├── index.html          # HTML entry point with SEO meta
│   ├── vite.config.js      # Vite config with API proxy
│   ├── package.json        # Frontend dependencies
│   └── src/
│       ├── main.jsx        # React root mount
│       ├── App.jsx         # Main app layout & state
│       ├── index.css       # Design system & palette
│       └── components/
│           ├── Dashboard.jsx       # Stats cards + traffic chart
│           ├── ShortenForm.jsx     # URL shortening form + QR
│           ├── LinksList.jsx       # Links table with actions
│           └── LinkDetailsModal.jsx # Full analytics modal
```

---

## 🎨 Color Palette 🖌️

| Element | Color | Hex |
| :--- | :--- | :--- |
| Page Background | Soft Lavender | `#F7F6FF` |
| Cards / Inputs | White | `#FFFFFF` |
| Borders / Dividers | Lavender Gray | `#E4E2F0` |
| Muted Text | Cool Gray | `#6B6880` |
| Primary Accent | Purple | `#7C3AED` |
| Success | Green | `#16A34A` |
| Danger | Red | `#E11D48` |

---

## 🚀 Quick Start Setup ⚙️

### Prerequisites 📋
- Node.js (v18+)
- MongoDB (optional — app auto-falls back to in-memory DB)

### 1. Clone & Navigate 📥
```bash
git clone <your-repo-url>
cd url-shortener
```

### 2. Environment Setup 🔧
Create a `.env` file in the root `url-shortener/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/url_shortener
NODE_ENV=development
```

### 3. Install Dependencies 📦
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### 4. Run Development Servers 🏃‍♂️

**Terminal 1 — Backend (API Server):**
```bash
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend (Vite):**
```bash
npm run client
# Client runs on http://localhost:5173 (API calls proxy to :5000)
```

### 5. Build & Unified Run (Production) 🏭
```bash
# Compile client assets
npm run client:build

# Start the unified Express server serving React build files
npm start
# Visit unified application on http://localhost:5000
```

---

## 📄 License 📜
Distributed under the MIT License.

---

Made with ❤️ by Jayshree
