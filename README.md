# 🎬 Movie Dashboard Application  

---

##
---

## 🎯 Project Objective
Aplikasi ini dibangun untuk memenuhi seluruh requirement, yaitu:
- Mengonsumsi **API publik**
- Menyimpan data ke dalam **database**
- Menyediakan fitur **manajemen data (CRUD)**
- Menampilkan **dashboard analitik sederhana**
- Menyediakan **visualisasi data** dan **filter tanggal**

---

## 🛠 Technology Stack

### Backend
- Node.js
- Express.js
- MySQL
- Axios
- dotenv

### Frontend
- React (Vite)
- Axios
- Chart.js
- react-chartjs-2

### Public API
- The Movie Database (TMDB)

---
---

## ⚙️ Installation & Setup

### Backend Setup
1. Masuk ke folder backend  
```bash
cd movie-dashboard-backend
npm install
cp .env.example .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_dashboard
TMDB_API_KEY=your_tmdb_api_key
PORT=3000
node index.js
http://localhost:3000


### frontend setup
cd movie-dashboard-frontend
npm install
npm run dev
http://localhost:5173




