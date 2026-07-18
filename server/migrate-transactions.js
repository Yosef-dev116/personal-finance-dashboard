import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transactionsPath = path.join(__dirname, "transactions.json");

const transactions = JSON.parse(fs.readFileSync(transactionsPath, "utf8"));

try {
  for (const transaction of transactions) {
    await pool.query(
      `
        INSERT INTO transactions (
          id,
          amount,
          category,
          date,
          type,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING;
      `,
      [
        transaction.id,
        transaction.amount,
        transaction.category,
        transaction.date,
        transaction.type ?? "expense",
        transaction.createdAt,
      ],
    );
  }

  console.log(`Migrated ${transactions.length} transactions.`);
} catch (error) {
  console.error("Migration failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
