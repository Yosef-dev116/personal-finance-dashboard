# Personal Finance App

A full-stack personal finance web app with a React dashboard, Express API, in-memory transaction storage, and OpenAI-powered financial analysis.

## Features

- Add expenses with amount, category, and date
- View a live transaction list
- See spending split by category in a pie chart
- Analyze your finances with AI-generated advice
- Responsive, modern UI

## Project Structure

- `client/` React frontend built with Vite
- `server/` Express backend with in-memory storage and OpenAI integration

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create an environment file for the server by copying `server/.env.example` to `server/.env`.

3. Add your OpenAI API key to `server/.env`:

```env
OPENAI_API_KEY=your_api_key_here
PORT=4000
```

4. Start the backend:

```bash
npm run dev:server
```

5. Start the frontend in another terminal:

```bash
npm run dev:client
```

6. Open the app at the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

- `GET /transactions` returns all stored transactions
- `POST /transactions` creates a new transaction
- `POST /analyze` sends current transactions to OpenAI and returns financial advice

## Notes

- Transactions are stored only in memory, so restarting the server clears them.
- If the OpenAI API key is missing, the analysis endpoint returns a helpful error.
