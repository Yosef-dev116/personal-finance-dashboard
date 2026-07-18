import { pool } from "./db.js";

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMPTZ NOT NULL
  );
`;

try {
  await pool.query(createTableQuery);
  console.log("Transactions table is ready.");
} catch (error) {
  console.error("Failed to create transactions table:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
