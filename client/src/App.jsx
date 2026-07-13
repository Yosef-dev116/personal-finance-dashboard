import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const API_BASE_URL = "http://localhost:4000";
const COLORS = ["#0f766e", "#ea580c", "#0284c7", "#7c3aed", "#65a30d", "#dc2626"];

const initialForm = {
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10)
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/transactions`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load transactions.");
      }

      setTransactions(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          category: form.category,
          date: form.date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save transaction.");
      }

      setTransactions((current) => [data, ...current]);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete transaction.");
      }

      setTransactions((current) => current.filter((transaction) => transaction.id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAnalyze() {
    try {
      setAnalyzing(true);
      setError("");
      setAdvice("");

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transactions })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze finances.");
      }

      setAdvice(data.advice);
    } catch (analysisError) {
      setError(analysisError.message);
    } finally {
      setAnalyzing(false);
    }
  }

  const totalSpend = transactions.reduce((sum, transaction) => {
    return sum + Number(transaction.amount);
  }, 0);

  const chartData = Object.values(
    transactions.reduce((summary, transaction) => {
      const category = transaction.category || "Other";

      if (!summary[category]) {
        summary[category] = { name: category, value: 0 };
      }

      summary[category].value += Number(transaction.amount);
      return summary;
    }, {})
  );

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="dashboard">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Personal finance dashboard</p>
            <h1>Track spending clearly and get practical AI guidance.</h1>
            <p className="hero-copy">
              Add expenses, review where your money goes, and generate tailored financial advice from your recent transactions.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span>Total spend</span>
              <strong>{formatCurrency(totalSpend)}</strong>
            </div>
            <div className="stat-card">
              <span>Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>
        </section>

        <section className="grid-layout">
          <article className="panel">
            <div className="panel-header">
              <h2>Add expense</h2>
              <p>Record a new transaction in seconds.</p>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <label>
                Amount
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  placeholder="45.99"
                  required
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="Groceries"
                  required
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  required
                />
              </label>

              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add expense"}
              </button>
            </form>
          </article>

          <article className="panel chart-panel">
            <div className="panel-header">
              <h2>Spending by category</h2>
              <p>Your category split updates automatically.</p>
            </div>

            <div className="chart-wrapper">
              {chartData.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">Add transactions to see your spending chart.</div>
              )}
            </div>

            <div className="category-legend">
              {chartData.map((item, index) => (
                <div className="legend-item" key={item.name}>
                  <span
                    className="legend-swatch"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.value)}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid-layout lower-grid">
          <article className="panel transactions-panel">
            <div className="panel-header">
              <h2>Transactions</h2>
              <p>Recent expenses across all categories.</p>
            </div>

            {loading ? (
              <div className="empty-state">Loading transactions...</div>
            ) : transactions.length ? (
              <div className="transaction-list">
                {transactions.map((transaction) => (
                  <div className="transaction-row" key={transaction.id}>
                    <div>
                      <strong>{transaction.category}</strong>
                      <p>{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="transaction-actions">
                      <span>{formatCurrency(transaction.amount)}</span>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                        aria-label={`Delete ${transaction.category} transaction`}
                      >
                        {deletingId === transaction.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No transactions yet. Add your first expense.</div>
            )}
          </article>

          <article className="panel analysis-panel">
            <div className="panel-header">
              <h2>AI financial advice</h2>
              <p>Generate a summary based on your current spending.</p>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={handleAnalyze}
              disabled={!transactions.length || analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze my finances"}
            </button>

            <div className="advice-box">
              {advice || "Your personalized advice will appear here after analysis."}
            </div>
          </article>
        </section>

        {error ? <div className="error-banner">{error}</div> : null}
      </main>
    </div>
  );
}

export default App;

