# 💰 Personal Finance Dashboard (Full-Stack Expense Tracker)

A modern full-stack personal finance dashboard built with **React**, **Express**, and **Node.js**. Users can add, edit, delete, and visualize expenses while receiving AI-powered financial insights through an intuitive dashboard.

Built to demonstrate full-stack web development skills including REST APIs, CRUD operations, data persistence, responsive UI design, data visualization, and AI integration.

---

# 🌐 Live Demo

🚧 Coming Soon...

---

# 📸 Screenshots

> Dashboard screenshots will be added as the project evolves.

---

# ✨ Features

- ✅ Add new transactions
- ✅ Edit existing transactions
- ✅ Delete transactions
- ✅ Persistent transaction storage
- ✅ Spending dashboard
- ✅ Category pie chart visualization
- ✅ AI-powered financial advice
- ✅ RESTful API backend
- ✅ Responsive modern UI
- 🚧 Search transactions
- 🚧 Filter by category
- 🚧 Monthly reports
- 🚧 Income tracking

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
- OpenAI API

## Data Storage

- JSON file-based persistence

---

# 📂 Project Structure

```text
client/
├── src/
├── public/
└── package.json

server/
├── index.js
├── transactions.json
├── .env.example
└── package.json
```

---

# 🚀 Getting Started

## 1. Install dependencies

```bash
npm run install:all
```

## 2. Configure environment variables

Copy

```text
server/.env.example
```

to

```text
server/.env
```

Add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
PORT=4000
```

## 3. Start the backend

```bash
npm run dev:server
```

## 4. Start the frontend

```bash
npm run dev:client
```

Open your browser:

```
http://localhost:5173
```

---

# 📌 REST API

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/transactions` | Get all transactions |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| POST | `/analyze` | Generate AI financial advice |

---

# 📊 Current Functionality

- Track expenses
- View total spending
- View total transactions
- Edit transactions
- Delete transactions
- Visualize spending by category
- Store data between sessions
- Generate AI financial recommendations

---

# 🗺️ Roadmap

## Completed

- [x] CRUD Transactions
- [x] Dashboard statistics
- [x] Spending visualization
- [x] AI financial insights
- [x] File-based data persistence
- [x] Responsive interface

## Planned Features

- [ ] Search transactions
- [ ] Filter by category
- [ ] Sort transactions
- [ ] Monthly spending reports
- [ ] Income tracking
- [ ] Budget goals
- [ ] Export transactions (CSV/PDF)
- [ ] User authentication
- [ ] SQL database (PostgreSQL)
- [ ] Cloud deployment
- [ ] Dark/Light theme toggle

---

# 📚 What I Learned

Building this project strengthened my understanding of:

- Building REST APIs with Express
- React state management
- CRUD application development
- JSON file persistence
- Data validation
- API integration with OpenAI
- Responsive UI design
- Data visualization using Recharts
- Git and GitHub workflows

---

# 👤 Author

**Yosef Mekonnen**

Computer Science Student — University of Prince Edward Island (UPEI)

GitHub:
https://github.com/Yosef-dev116

LinkedIn:
https://www.linkedin.com/in/yosefmekonnen

---

# 📄 License

This project is licensed under the MIT License.

---

⭐ Built as a portfolio project to demonstrate modern full-stack web development skills and continuously expanded with new features.
