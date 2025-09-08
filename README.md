# 🌦️ Weathrly

A dynamic **Weather App** built with **Node.js** and **Express.js**, featuring a **custom user authentication system**.  
It allows users to check **current weather conditions**, securely manage accounts with signup/login, access a personalized dashboard, and even fetch weather for their **current live location**.  

This project highlights:  
✔️ Secure backend practices (password hashing, input validation, API rate limiting)  
✔️ Clean and responsive **user experience**  
✔️ Robust **error handling & logging**  

---

## ✨ Features

- 🌍 **Live Location Pointer**: Detects the user’s current geolocation and shows weather updates instantly.  
- ⛅ **Real-time Weather Data**: Displays current weather information for multiple locations.  
- 🔑 **User Authentication & Authorization**  
  - Secure signup/login with hashed passwords (`bcrypt`)  
  - Session-based authentication  
  - Protected routes for authenticated users  
- 🛡 **Input Validation & Sanitization**: Prevents XSS, injection attacks via `express-validator`.  
- 🚦 **API Rate Limiting**: Prevents abuse using `express-rate-limit`.  
- 🔐 **Environment Variables**: Secure secret/API management via `dotenv`.  
- 🐞 **Error Handling & Logging**: Centralized system for easy debugging.  
- 📱 **Responsive Design**: Works across devices.  
- 🖥 **User Dashboard**: Personalized experience for logged-in users.  
- 📂 **Static File Serving**: Efficient HTML, CSS, and JS delivery.  

---

## 🛠️ Technologies Used

### 🔹 Backend
- [Node.js](https://nodejs.org/)  
- [Express.js](https://expressjs.com/)  
- [bcrypt](https://www.npmjs.com/package/bcrypt)  
- [express-session](https://www.npmjs.com/package/express-session)  
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)  
- [dotenv](https://www.npmjs.com/package/dotenv)  
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)  
- [express-validator](https://express-validator.github.io/docs/)  

### 🔹 Frontend
- **HTML5**  
- **CSS3**  
- **JavaScript** (includes **Geolocation API** for live location)  

### 🔹 Storage
- `users.json` (demo storage – replace with **MongoDB/PostgreSQL/MySQL** in production).  

---
