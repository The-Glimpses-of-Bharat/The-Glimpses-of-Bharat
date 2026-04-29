# Glimpse of Bharat - Backend

A robust and scalable backend system for the Glimpse of Bharat application. This server manages historical data on freedom fighters, handles user-generated contributions, powers educational quizzes, and is designed using modern backend architecture and design patterns.

# Tech Stack

* Runtime: Node.js
* Framework: Express.js
* Database: MongoDB (with Mongoose ODM)
* Security: JWT, dotenv, Helmet, CORS
* Design Patterns: Factory Pattern, Strategy Pattern

# Project Structure

```plaintext
backend/
├── config/             # Database & environment configurations
├── controllers/        # Business logic for each route
├── middleware/         # Authentication, error handling, validation
├── models/             # Mongoose schemas (User, Fighter, Quiz)
├── routes/             # API endpoint definitions
├── utils/              # Helper functions & design patterns
├── server.js           # Application entry point
└── .env                # Environment variables (gitignored)
```

# API Reference

## General

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check / Server status |

## Freedom Fighters

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fighters` | Fetch all freedom fighters |
| GET | `/api/fighters/:id` | Fetch details of a specific fighter |

## Contributions & Quiz

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contribute` | Submit new data for review |
| GET | `/api/quiz` | Fetch randomized quiz questions |

# Installation & Setup

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/glimpseDB
JWT_SECRET=your_super_secret_key
```

## 4. Run the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

# System Architecture & Design

To ensure scalability, modularity, and maintainability, the system is designed using structured diagrams and patterns:

### Use Case Diagram

Defines system interactions for different roles:

* User: Basic features
* Premium User: Exclusive content access
* Contributor: Submit and edit content
* Admin: Moderation and system control

### ER Diagram

Represents database structure and relationships between:

* User
* Fighter
* Contribution
* Quiz
* Chat Logs

Ensures normalized and efficient data design.

### Class Diagram

The Class Diagram represents the object-oriented structure of the application, showing how different classes, their attributes, methods, and relationships are organized in the system.

I designed this diagram to model the backend architecture using OOP principles. It includes core entities such as User, Admin, Contributor, HistoricalFigure, Contribution, Quiz, Game, Subscription, and ChatInteraction. The diagram reflects how different components of the system are structured and how they interact at the code level.

The system is built around the following key classes:
* User: Base class with common attributes and methods
* Admin, Contributor, PremiumUser: Derived classes (inherit from User)
* HistoricalFigure: Stores information about fighters
* Contribution: Handles user-submitted data
* Book & Journal: Represents premium content
* Quiz & Question: Manages quiz functionality
* Game & GameSession: Handles gameplay logic
* Subscription: Manages premium access
* ChatInteraction: Handles AI chatbot queries

The diagram includes multiple types of relationships:
* Inheritance (Generalization): Admin, Contributor, PremiumUser extend User
* Associations: User to Contribution, HistoricalFigure to Book / Journal, Quiz to Question
* Aggregation / Composition: Quiz to Questions (strong relationship), Game to GameSession

These relationships ensure a modular and well-connected system design. I followed Object-Oriented Design (OOD) principles, ensured separation of concerns across classes, used inheritance to avoid redundancy, and designed classes to be reusable and scalable. 

This diagram helped me plan the backend structure before implementation, understand how different modules interact, maintain a clean and modular codebase, and map real-world features into structured classes.

The Class Diagram provides a blueprint of the system's code structure, ensuring that the backend is well-organized, maintainable, and aligned with object-oriented best practices.

### Sequence Diagram

Shows runtime interactions such as:

* Authentication (JWT flow)
* Fetching fighters
* AI chatbot interaction
* Contribution submission
* Admin moderation

Helps visualize request-response lifecycle.

### System Architecture Diagram

Illustrates the complete system:

* Frontend (React)
* Backend (Node.js + Express)
* Database (MongoDB)
* AI Services

Ensures clear separation of concerns and scalability.

# Design Patterns Used

### Factory Pattern

Used to dynamically create user objects based on roles during authentication and registration.

### Strategy Pattern

Encapsulates different payment methods allowing flexible and extendable checkout logic.

# Roadmap

* [x] Initial Express + MongoDB setup
* [x] Build Admin Dashboard (CRUD operations)
* [ ] Implement JWT Authentication & RBAC
* [ ] Migrate to TypeScript
* [ ] Integrate AI Chatbot

# Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

# License

Distributed under the MIT License. See `LICENSE` for more information.

# Final Note

This backend is designed with a strong focus on scalability, clean architecture, and real-world system design principles, making it suitable for both learning and production-level extension. 
