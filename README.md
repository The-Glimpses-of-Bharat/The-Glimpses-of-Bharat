# 🌏 Glimpse of Bharat – Backend

A scalable backend for the **Glimpse of Bharat** application, managing freedom fighters data, user contributions, quizzes, and more.

---

## 🚀 Tech Stack

* Node.js, Express.js
* MongoDB + Mongoose
* dotenv

---

## 📁 Project Structure

```
backend/
├── config/        # DB connection
├── routes/        # API routes
├── models/        # Schemas (planned)
├── controllers/   # Logic (planned)
├── middleware/    # Auth, errors (planned)
├── server.js      # Entry point
└── .env
```

---

## 🌐 API Overview

* `GET /` → Check server status
* Auth → Register/Login (planned)
* Fighters → Fetch data
* Contributions → Submit & approve
* Quiz → Fetch & submit answers

---

## ⚙️ Setup

```bash
git clone <repo>
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_uri
PORT=5000
```

Run:

```bash
node server.js
```

---

## 🔌 Database

MongoDB connected via Mongoose:

```
MongoDB Connected ✅
```

---

## 📊 System Design & Diagrams

To ensure a clean and scalable system, the following diagrams were designed:

* **Use Case Diagram** → Defines user roles & interactions (User, Admin, Contributor, Premium)
* **ER Diagram** → Designs database (User, Fighter, Contribution, Quiz, etc.)
* **Class Diagram** → Backend OOP structure with inheritance
* **Sequence Diagram** → Request-response flows (auth, contributions, chatbot)
* **Architecture Diagram** → Frontend + Backend + DB + APIs

These help in building a **modular, maintainable, and scalable system**.

---

## 🧩 Design Patterns Used

* **Factory Pattern** → Used for creating different user types (Admin, Contributor, Premium User) dynamically based on role.
* **Strategy Pattern** → Used in payment system to support multiple payment methods (e.g., UPI, Card, etc.) by switching algorithms at runtime.

These patterns help keep the system flexible, scalable, and easy to extend.

---

## 🧠 Future Scope

* TypeScript migration
* MVC architecture
* Auth & role-based access
* Full CRUD APIs
* AI chatbot

---

## 📌 Roadmap

1. Backend setup ✅
2. Auth system 🔜
3. Core modules
4. Admin flow
5. Advanced features

---

## 🤝 Contributing

Pull requests are welcome.

---

## 📄 License

Educational use only.
