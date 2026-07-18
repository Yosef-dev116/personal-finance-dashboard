# 💰 Personal Finance Dashboard

A production-ready **full-stack personal finance management application** built with **React**, **Express.js**, **Node.js**, **PostgreSQL**, and the **OpenAI API**.

The application allows users to track income and expenses, visualize financial data, generate AI-powered financial insights, and manage transactions through a responsive dashboard.

This project demonstrates modern full-stack development including REST APIs, CRUD operations, SQL databases, cloud deployment, responsive UI design, data visualization, and AI integration.

---

# 🌐 Live Demo

### Frontend (Vercel)

https://personal-finance-dashboard-eosin-alpha.vercel.app

### Backend API (Render)

https://personal-finance-dashboard-lrap.onrender.com

---

# 📸 Screenshots



<img width="938" height="413" alt="Screenshot 2026-07-18 162035" src="https://github.com/user-attachments/assets/cb0ce33c-9d4a-4b6d-8842-9d8bc4fe54be" />

<img width="944" height="410" alt="Screenshot 2026-07-18 162059" src="https://github.com/user-attachments/assets/efa4aec3-fbcc-42b3-83b8-572aea98a2b8" />

<img width="942" height="415" alt="Screenshot 2026-07-18 162120" src="https://github.com/user-attachments/assets/8a272766-b368-4044-8fe1-59b8b2dd7ed6" />

<img width="938" height="390" alt="Screenshot 2026-07-18 162229" src="https://github.com/user-attachments/assets/8ff21add-a61d-4791-a8f5-a357561ce6a2" />

<img width="592" height="397" alt="Screenshot 2026-07-18 162259" src="https://github.com/user-attachments/assets/7eba9ee1-c7f6-4a25-b4fb-028f4275fcb5" />

<img width="865" height="409" alt="Screenshot 2026-07-18 162529" src="https://github.com/user-attachments/assets/d3b050bf-ea44-41de-be4d-bca34d0fdca6" />

# ✨ Features

## Transaction Management

- ✅ Create transactions
- ✅ Edit transactions
- ✅ Delete transactions
- ✅ Search transactions
- ✅ Sort transactions
- ✅ Persistent PostgreSQL storage

---

## Financial Dashboard

- ✅ Income tracking
- ✅ Expense tracking
- ✅ Net balance calculation
- ✅ Financial summary
- ✅ Monthly reports
- ✅ Monthly spending trends
- ✅ Income vs Expense comparison
- ✅ Spending by category chart

---

## AI Features

- ✅ AI-generated financial analysis
- ✅ Personalized financial recommendations

---

## User Experience

- ✅ Responsive design
- ✅ Modern dark theme
- ✅ Real-time dashboard updates

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- CSS
- Recharts

## Backend

- Node.js
- Express.js
- REST API

## Database

- PostgreSQL
- Neon

## AI

- OpenAI API

## Deployment

- Vercel
- Render

---

# 🏗️ Architecture

```text
React (Vercel)
        │
        ▼
Express REST API (Render)
        │
        ▼
PostgreSQL Database (Neon)
```

---

# 📂 Project Structure

```text
client/
├── src/
├── public/
└── package.json

server/
├── db.js
├── index.js
├── init-db.js
├── migrate-transactions.js
├── .env.example
└── package.json
```

---

# 🚀 Getting Started

## Install dependencies

```bash
npm run install:all
```

## Configure Environment Variables

Copy

```text
server/.env.example
```

to

```text
server/.env
```

Add:

```env
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_neon_connection_string
PORT=4000
```

---

## Start Backend

```bash
npm run dev:server
```

---

## Start Frontend

```bash
npm run dev:client
```

Open:

```
http://localhost:5173
```

---

# 📌 REST API

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/transactions` | Retrieve all transactions |
| POST | `/transactions` | Create a transaction |
| PUT | `/transactions/:id` | Update a transaction |
| DELETE | `/transactions/:id` | Delete a transaction |
| POST | `/analyze` | Generate AI financial insights |

---

# 📊 Current Functionality

### Dashboard

- Total Income
- Total Expenses
- Net Balance
- Transaction Count

### Reports

- Monthly Reports
- Spending Trends
- Income vs Expense Analysis
- Largest Expense
- Highest Spending Category

### Transaction Management

- Full CRUD Operations
- Search
- Sorting

### Analytics

- Financial Summary
- Spending by Category
- AI Financial Advice

---

# 🗺️ Roadmap

## Completed

- [x] Full CRUD Operations
- [x] PostgreSQL Database Integration
- [x] REST API
- [x] Search & Sorting
- [x] Financial Dashboard
- [x] Monthly Reports
- [x] AI Financial Insights
- [x] Responsive UI
- [x] Production Deployment
- [x] Cloud Database Migration

## Planned

- [ ] User Authentication
- [ ] Budget Goals
- [ ] Recurring Transactions
- [ ] Export CSV/PDF
- [ ] Email Notifications
- [ ] Dark / Light Theme Toggle

---

# 📚 What I Learned

Building this project strengthened my understanding of:

- React application architecture
- Express.js backend development
- REST API design
- CRUD operations
- PostgreSQL and SQL
- Database migrations
- Environment variables
- Cloud deployment with Vercel and Render
- AI integration using OpenAI
- Data visualization with Recharts
- Git & GitHub workflows
- Production debugging

---

# 👤 Author

**Yosef Mekonnen**

Computer Science Student  
University of Prince Edward Island (UPEI)

GitHub

https://github.com/Yosef-dev116

LinkedIn

https://www.linkedin.com/in/yosefmekonnen

---

# 📄 License

MIT License

---

⭐ Built to demonstrate production-ready full-stack web development using React, Express, PostgreSQL, and OpenAI.
