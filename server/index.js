import { randomUUID } from "node:crypto";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let transactions = [
  {
    id: "seed-1",
    amount: 42.5,
    category: "Groceries",
    date: "2026-04-02",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-2",
    amount: 18,
    category: "Transport",
    date: "2026-04-03",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-3",
    amount: 65,
    category: "Dining",
    date: "2026-04-05",
    createdAt: new Date().toISOString()
  }
];

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
  const { amount, category, date } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0." });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Category is required." });
  }

  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "A valid date is required." });
  }

  const transaction = {
    id: randomUUID(),
    amount: Number(amount),
    category: category.trim(),
    date,
    createdAt: new Date().toISOString()
  };

  transactions = [transaction, ...transactions];
  res.status(201).json(transaction);
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
    const totalSpend = submittedTransactions.reduce((sum, transaction) => {
      return sum + Number(transaction.amount || 0);
    }, 0);

    const categorySummary = submittedTransactions.reduce((summary, transaction) => {
      const key = transaction.category || "Other";
      summary[key] = (summary[key] || 0) + Number(transaction.amount || 0);
      return summary;
    }, {});

    const prompt = [
      "You are a practical personal finance coach.",
      "Review the user's expense history and provide concise, useful advice.",
      "Give:",
      "1. A one-sentence overview",
      "2. Three actionable recommendations",
      "3. One spending pattern worth watching",
      `Total spend: ${totalSpend.toFixed(2)}`,
      `Category summary: ${JSON.stringify(categorySummary)}`,
      `Transactions: ${JSON.stringify(submittedTransactions)}`
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
