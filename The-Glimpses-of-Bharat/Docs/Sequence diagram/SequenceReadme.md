# 🔄 Sequence Diagram

🔗 **View Diagram:** https://drive.google.com/file/d/1aByMrk6xpBfIW6zmVLfXlBcQ5qZa7FYG/view?usp=sharing

The Sequence Diagram represents the **runtime flow of the application**, showing how different components interact with each other during various operations.

---

## 📌 Overview

I designed this diagram to capture the **step-by-step communication** between:

* User
* Frontend (React)
* Backend API (Node.js + Express)
* Authentication Middleware (JWT)
* Service Layer
* Database (MongoDB)
* AI Service

---

## ⚙️ Flows Covered

The diagram includes multiple real-world flows:

* **Authentication** (Login with JWT generation)
* **Fetching Fighters** (Protected API with token verification)
* **AI Chatbot Interaction** (External service integration)
* **Contribution Submission** (Pending approval workflow)
* **Admin Moderation** (Approve/Reject contributions)

---

## 🔁 Interaction Details

* **Solid arrows** represent requests (API calls / function calls)
* **Dashed arrows** represent responses (data returned)
* **Activation bars** indicate execution time of components
* Real API endpoints are used (e.g., `POST /auth/login`, `GET /fighters`)

---

## 🎯 Why I Created This

This diagram helped me:

* Understand the **end-to-end request-response lifecycle**
* Visualize how different layers (frontend, backend, database) interact
* Design a **structured and scalable backend flow**
* Identify where authentication, business logic, and external services fit

---

## 🚀 Key Takeaway

The Sequence Diagram provides a clear view of how the system behaves at runtime, ensuring that all components are properly connected and interactions are logically structured.
