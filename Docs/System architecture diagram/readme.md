**System Architecture Diagram
**
**View Diagram**: https://lucid.app/lucidspark/78eff628-2b0b-4f52-8a32-d53582f6a663/edit?view_items=~_iM~f3X_edu&page=0_0&invitationId=inv_36d559c7-55dc-47b4-acb2-dba85f8e982e

The System Architecture Diagram provides a high-level overview of how different components of the application are structured and how they interact with each other.

**Overview**
I designed this diagram to represent the overall architecture of the system, including the frontend, backend, database, and external services.
The system is structured using a layered approach:
Frontend (React) → User interface and interaction
Backend (Node.js + Express) → API handling and business logic
Database (MongoDB) → Data storage and retrieval
External Services → AI chatbot integration

**Architecture Components
**🌐 **Frontend**
Built using React
Handles UI rendering and user interactions
Sends API requests to the backend

**Backend**
Built using Node.js and Express (TypeScript)
Divided into:
API Layer (routing)
Authentication Middleware (JWT verification)
Service Layer (business logic)

**Database**
MongoDB is used for storing:
Users
Fighters
Contributions
Quiz data
Chat logs

**External Services**
AI Chatbot service for handling user queries
Integrated via backend API

**Data Flow**
The typical flow of data in the system:
User → Frontend → Backend API → Middleware → Service Layer → Database
↘ AI Service
The frontend sends requests to the backend
The backend processes them through middleware and services
Data is fetched/stored in the database
AI-related queries are handled by external services

**Why we Created This**
This diagram helped me:
Understand the overall system structure
Ensure proper separation of concerns
Design a scalable and modular architecture
Visualize how different components communicate

**Key Takeaway**
The System Architecture Diagram provides a complete picture of how the application is built and how all components work together, ensuring clarity, scalability, and maintainability.

