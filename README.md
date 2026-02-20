# ExpertBook — Real-Time Expert Session Booking System

A full-stack booking platform in a **single project folder** — backend and frontend together.

---

## 📁 Project Structure

```
expertbook/                  ← Single root folder
├── server.js                ← Express + Socket.io entry point
├── seed.js                  ← Database seeder (12 experts)
├── package.json             ← Root: backend deps + scripts
├── .env.example             ← Environment variable template
│
├── server/                  ← Backend logic
│   ├── routes/
│   │   ├── experts.js
│   │   └── bookings.js
│   ├── controllers/
│   │   ├── expertController.js
│   │   └── bookingController.js
│   └── models/
│       ├── Expert.js
│       └── Booking.js
│
├── client/                  ← React frontend
│   ├── package.json
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── components/
│       │   └── Navbar.js
│       ├── context/
│       │   └── SocketContext.js
│       ├── pages/
│       │   ├── ExpertList.js      ← Screen 1
│       │   ├── ExpertDetail.js    ← Screen 2 (real-time)
│       │   ├── BookingPage.js     ← Screen 3
│       │   └── MyBookings.js      ← Screen 4
│       └── utils/
│           └── api.js
│
└── public/
    └── index.html
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
# From the root expertbook/ folder — installs everything at once:
npm run install:all
```

### 2. Set up environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expertbook
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Also create `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Seed the database

```bash
npm run seed
# Adds 12 experts with 2 weeks of available time slots
```

### 4. Run everything — one command

```bash
npm start
```

Starts the backend (port 5000) and React frontend (port 3000) simultaneously. Visit **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/experts` | List experts (`?search=&category=&page=&limit=`) |
| GET | `/api/experts/:id` | Expert detail with time slots |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings?email=` | Get bookings by email |
| PATCH | `/api/bookings/:id/status` | Update booking status |

---

## ⚡ Key Features

- **Real-time slots** via Socket.io — slots update live across all open browsers
- **No double booking** — MongoDB transactions + compound unique index
- **Full validation** — client-side inline errors + server-side express-validator
- **4 screens** — Expert List, Expert Detail, Booking Form, My Bookings
