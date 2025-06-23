# 🏠 FindHome Frontend

FindHome is a modern real estate platform that enables users to explore, book, and manage properties such as homes, hotels, and apartments. This repository contains the **React.js frontend** of the application.

---

## 🌐 Live Site

Frontend (Vercel): [https://findhome-frontend.vercel.app](https://findhome-frontend-naqjhk7u4-dwidens-projects.vercel.app/)  
Backend (GitHub): [FindHome Backend](https://github.com/Dwidenbrahma/findhome-backend)

---

## 🚀 Features

- 🔍 Browse and filter properties by type, city, or features
- 🛏️ View property details with images, reviews, and panoramic views
- 💳 Book properties with secure Stripe payments
- 📬 Email confirmation after booking
- 🧾 User dashboard to view bookings
- 🏢 Owner dashboard to manage listings
- ❤️ Wishlist functionality
- 📝 Review system
- 🔒 JWT-based authentication for users and property owners

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Tailwind CSS
- **State Management:** useState, useEffect, Context API
- **API Calls:** Axios
- **Backend:** Node.js + Express.js (via [backend repo](https://github.com/Dwidenbrahma/findhome-backend))
- **Database:** MongoDB
- **Payment Integration:** Stripe

---

## 📁 Folder Structure

src/
├── components/ # Shared and reusable components
├── App.jsx # Main routing component
└── index.jsx # App entry point



---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Dwidenbrahma/findhome-frontend.git
cd findhome-frontend
npm install
REACT_APP_API_URL=https://your-backend-url.com
npm start
```

