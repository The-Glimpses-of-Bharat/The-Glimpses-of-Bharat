# 🎭 Use Case Diagram - The Glimpses of Bharat

> A comprehensive UML use case diagram showcasing user interactions and system functionalities across different roles.

---

![Usecase Diagram Flow]<img width="1940" height="1348" alt="image" src="https://github.com/user-attachments/assets/f7828b30-3caf-4b43-8ce8-a9dfc748e492" />


## 📋 Quick Links

| Link | Description |
|------|-------------|
| 🔗 [View Full Diagram](https://drive.google.com/file/d/1ShYJv8bK-hcQZKRt_YMNvYUpRIB8VNca/view?usp=sharing) | Interactive Google Drive preview |

---

## 📌 Overview

The Use Case Diagram represents how different users interact with the system and what functionalities are available to them based on their roles. I designed this diagram to capture the functional requirements of the application by identifying different types of users and their interactions with the system.

### 👥 Actor Hierarchy

The main actors included are:

| Actor | Access Level | Description |
|-------|--------------|-------------|
| **User** | Basic | Standard user with core features |
| **Premium User** | Extended | Enhanced access with premium content |
| **Contributor** | Submission | Can submit and edit content |
| **Admin** | Full Control | System management and moderation |

> **Note:** Actor hierarchy is implemented using generalization, where Premium User, Contributor, and Admin extend the base User role.

---

## ⚙️ Functionalities Covered

### 🔐 Authentication
- Register
- Login

### 👤 User Features
- View Fighters
- View Map
- Play Quiz
- Attempt Daily Trivia
- Interact with AI Chatbot

### ⭐ Premium Features
- Access Books
- Access Journals
- Access Knowledge Base

### 📝 Contributor Features
- Submit Contribution
- Edit Contribution

### 🛡️ Admin Features
- Approve / Reject Contributions
- Manage Fighters
- Manage Users

---

## 🔗 Relationships Used

### Include (Mandatory Flows)
`<<include>>` is used for mandatory flows:

```
Login          ──include──> Authenticate User
Play Quiz      ──include──> Fetch Questions
AI Chatbot     ──include──> Process Query
```

### Extend (Optional/Conditional Features)
`<<extend>>` is used for optional or conditional features:

```
Access Journals        ──extend──> View Fighters
Access Knowledge Base  ──extend──> View Fighters
```

---

## 🎯 Design Rationale

This diagram helped me:

- ✅ Clearly define user roles and permissions
- ✅ Understand which features belong to which user type
- ✅ Structure the application based on role-based access control (RBAC)
- ✅ Identify all core functionalities before implementation
- ✅ Ensure scalability and future feature additions

---

## 📊 Diagram Preview

The use case diagram visually illustrates:

1. **System Boundary** - Clear demarcation of what's inside the system
2. **Actors** - External entities that interact with the system
3. **Use Cases** - Specific functionalities and services provided
4. **Relationships** - Dependencies and interactions between use cases

---

## 🚀 Key Takeaways

The Use Case Diagram provides a clear **high-level view of the system from a user's perspective**, ensuring that all features and interactions are:

- ✨ Properly planned
- 🎯 Aligned with user roles
- 🔄 Well-structured for development
- 📈 Scalable for future enhancements

---

## 📚 Related Documentation

- [Sequence Diagram](../Sequence%20diagram/SequenceReadme.md)
- [System Architecture](../../README.md)

---

**Last Updated:** April 2026 | **Status:** ✅ Active
🚀 Key Takeaway
The Use Case Diagram provides a clear high-level view of the system from a user’s perspective, ensuring that all features and interactions are properly planned and aligned with user roles.

