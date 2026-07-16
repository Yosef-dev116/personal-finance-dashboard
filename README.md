# 💰 Personal Finance Dashboard

A modern **full-stack personal finance management application** built with **React**, **Express.js**, **Node.js**, and **OpenAI**. The application helps users track income and expenses, analyze spending patterns, and visualize financial data through an interactive dashboard.

Built to demonstrate full-stack web development skills including REST APIs, CRUD operations, responsive UI design, analytics dashboards, data visualization, and AI integration.

---

# 🌐 Live Demo

**Frontend (Vercel)**

https://personal-finance-dashboard-eosin-alpha.vercel.app

**Backend API (Render)**

https://personal-finance-dashboard-lrap.onrender.com

---

# 📸 Screenshots

> Dashboard screenshots will be added as the project continues to evolve.

---

# ✨ Features

## Transaction Management

- ✅ Add transactions
- ✅ Edit transactions
- ✅ Delete transactions
- ✅ Search transactions
- ✅ Sort transactions
- ✅ Persistent transaction storage

---

## Financial Dashboard

- ✅ Income tracking
- ✅ Expense tracking
- ✅ Net balance calculation
- ✅ Financial summary insights
- ✅ Monthly reports
- ✅ Monthly spending trends
- ✅ Income vs Expense comparison
- ✅ Spending by category pie chart

---

## AI Features

- ✅ AI-powered financial analysis
- ✅ Personalized financial recommendations

---

## User Experience

- ✅ Responsive modern UI
- ✅ Dark theme
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
- OpenAI API

## Current Data Storage

- JSON file-based persistence

## Deployment

- Vercel
- Render

---

# 📂 Project Structure

```text
client/
├── src/
├── public/
├── package.json
└── vite.config.js

server/
├── index.js
├── transactions.json
├── .env.example
└── package.json
```

---

# 🚀 Getting Started

## Install dependencies

```bash
npm run install:all
```

---

## Configure Environment Variables

Copy

```text
server/.env.example
```

to

```text
server/.env
```

Add

```env
OPENAI_API_KEY=your_api_key
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

Open

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
- Monthly Spending Trend
- Income vs Expense Analysis
- Largest Expense
- Highest Spending Category

### Transaction Management

- CRUD Operations
- Search
- Sorting

### Analytics

- Financial Summary
- Spending by Category
- AI Financial Advice

---

# 🗺️ Roadmap

## Completed

- [x] CRUD Transactions
- [x] Search Transactions
- [x] Transaction Sorting
- [x] Income Tracking
- [x] Financial Dashboard
- [x] Monthly Reports
- [x] Financial Summary
- [x] AI Financial Insights
- [x] Responsive UI
- [x] Full-stack Deployment
- [x] GitHub Portfolio Documentation

## In Progress

- [ ] PostgreSQL Database Migration

## Planned

- [ ] User Authentication
- [ ] Budget Goals
- [ ] Recurring Transactions
- [ ] Export CSV/PDF
- [ ] Notifications
- [ ] Cloud Database
- [ ] Dark / Light Theme Toggle

---

# 📚 What I Learned

Building this project strengthened my understanding of:

- React component architecture
- State management
- REST API development
- Express.js backend development
- CRUD application design
- JSON persistence
- AI integration with OpenAI
- Responsive UI development
- Data visualization using Recharts
- Git & GitHub workflows
- Deploying full-stack applications with Vercel and Render

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

⭐ This project is continuously being expanded to demonstrate production-ready full-stack web development skills.
