import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSACTIONS_PATH = path.join(__dirname, "transactions.json");
const ALLOWED_TYPES = new Set(["income", "expense"]);

const DEFAULT_TRANSACTIONS = [
  {
    id: "seed-1",
    amount: 42.5,
    category: "Groceries",
    date: "2026-04-02",
    type: "expense",
    createdAt: "2026-04-02T12:00:00.000Z"
  },
  {
    id: "seed-2",
    amount: 18,
    category: "Transport",
    date: "2026-04-03",
    type: "expense",
    createdAt: "2026-04-03T12:00:00.000Z"
  },
  {
    id: "seed-3",
    amount: 65,
    category: "Dining",
    date: "2026-04-05",
    type: "expense",
    createdAt: "2026-04-05T12:00:00.000Z"
  }
];

function normalizeTransaction(transaction) {
  return {
    ...transaction,
    type: ALLOWED_TYPES.has(transaction.type) ? transaction.type : "expense"
  };
}

function parseTransactionType(type) {
  if (type === undefined || type === null || type === "") {
    return "expense";
  }

  if (!ALLOWED_TYPES.has(type)) {
    return null;
  }

  return type;
}

function loadTransactionsFromFile() {
  try {
    if (!fs.existsSync(TRANSACTIONS_PATH)) {
      return DEFAULT_TRANSACTIONS;
    }
    const raw = fs.readFileSync(TRANSACTIONS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_TRANSACTIONS;
    }
    return parsed.map(normalizeTransaction);
  } catch (err) {
    console.error("Failed to load transactions.json:", err.message);
    return DEFAULT_TRANSACTIONS;
  }
}

function saveTransactionsToFile() {
  fs.writeFileSync(TRANSACTIONS_PATH, JSON.stringify(transactions, null, 2), "utf8");
}

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let transactions = loadTransactionsFromFile();
saveTransactionsToFile();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/transactions", (_req, res) => {
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  res.json(sortedTransactions);
});

app.post("/transactions", (req, res) => {
  const { amount, category, date, type } = req.body;
  const transactionType = parseTransactionType(type);

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0." });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Category is required." });
  }

  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "A valid date is required." });
  }

  if (!transactionType) {
    return res.status(400).json({ error: 'Type must be either "income" or "expense".' });
  }

  const transaction = {
    id: randomUUID(),
    amount: Number(amount),
    category: category.trim(),
    date,
    type: transactionType,
    createdAt: new Date().toISOString()
  };

  transactions = [transaction, ...transactions];
  saveTransactionsToFile();
  res.status(201).json(transaction);
});

app.put("/transactions/:id", (req, res) => {
  const index = transactions.findIndex((transaction) => transaction.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found." });
  }

  const { amount, category, date, type } = req.body;
  const transactionType = parseTransactionType(type);

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0." });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Category is required." });
  }

  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "A valid date is required." });
  }

  if (!transactionType) {
    return res.status(400).json({ error: 'Type must be either "income" or "expense".' });
  }

  const updatedTransaction = {
    ...transactions[index],
    amount: Number(amount),
    category: category.trim(),
    date,
    type: transactionType
  };

  transactions = [
    ...transactions.slice(0, index),
    updatedTransaction,
    ...transactions.slice(index + 1)
  ];
  saveTransactionsToFile();
  res.json(updatedTransaction);
});

app.delete("/transactions/:id", (req, res) => {
  const index = transactions.findIndex((transaction) => transaction.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found." });
  }

  transactions = transactions.filter((transaction) => transaction.id !== req.params.id);
  saveTransactionsToFile();
  res.json({ success: true });
});

app.post("/analyze", async (req, res) => {
  const submittedTransactions = req.body.transactions;

  if (!Array.isArray(submittedTransactions) || submittedTransactions.length === 0) {
    return res.status(400).json({ error: "Provide at least one transaction to analyze." });
  }

  if (!openai) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is missing. Add it to server/.env to enable analysis."
    });
  }

  try {
    const normalized = submittedTransactions.map(normalizeTransaction);

    const totalIncome = normalized.reduce((sum, transaction) => {
      return transaction.type === "income" ? sum + Number(transaction.amount || 0) : sum;
    }, 0);

    const totalExpenses = normalized.reduce((sum, transaction) => {
      return transaction.type === "expense" ? sum + Number(transaction.amount || 0) : sum;
    }, 0);

    const netBalance = totalIncome - totalExpenses;

    const expenseCategorySummary = normalized
      .filter((transaction) => transaction.type === "expense")
      .reduce((summary, transaction) => {
        const key = transaction.category || "Other";
        summary[key] = (summary[key] || 0) + Number(transaction.amount || 0);
        return summary;
      }, {});

    const incomeCategorySummary = normalized
      .filter((transaction) => transaction.type === "income")
      .reduce((summary, transaction) => {
        const key = transaction.category || "Other";
        summary[key] = (summary[key] || 0) + Number(transaction.amount || 0);
        return summary;
      }, {});

    const prompt = [
      "You are a practical personal finance coach.",
      "Review the user's income and expense history and provide concise, useful advice.",
      "Give:",
      "1. A one-sentence overview",
      "2. Three actionable recommendations",
      "3. One spending or income pattern worth watching",
      `Total income: ${totalIncome.toFixed(2)}`,
      `Total expenses: ${totalExpenses.toFixed(2)}`,
      `Net balance: ${netBalance.toFixed(2)}`,
      `Income category summary: ${JSON.stringify(incomeCategorySummary)}`,
      `Expense category summary: ${JSON.stringify(expenseCategorySummary)}`,
      `Transactions (include type): ${JSON.stringify(normalized)}`
    ].join("\n");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    res.json({
      advice: response.output_text || "No advice was generated."
    });
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    res.status(500).json({ error: "Failed to analyze finances." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
