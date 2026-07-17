import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE_URL = "https://personal-finance-dashboard-lrap.onrender.com";
const COLORS = [
  "#0f766e",
  "#ea580c",
  "#0284c7",
  "#7c3aed",
  "#65a30d",
  "#dc2626",
];
const INCOME_COLOR = "#4ade80";
const EXPENSE_COLOR = "#f87171";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
  { value: "category", label: "Category A-Z" },
];

const initialForm = {
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  type: "expense",
};

function getTransactionType(transaction) {
  return transaction?.type === "income" ? "income" : "expense";
}

function sortTransactions(list, sortBy) {
  const sorted = [...list];

  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "highest":
      return sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
    case "lowest":
      return sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
    case "category":
      return sorted.sort((a, b) =>
        (a.category || "").localeCompare(b.category || "", undefined, {
          sensitivity: "base",
        }),
      );
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatSignedAmount(amount, type) {
  const absolute = formatCurrency(Math.abs(Number(amount) || 0));
  return type === "income" ? `+${absolute}` : `-${absolute}`;
}

function getNetBalanceClass(net) {
  if (net > 0) return "amount-income";
  if (net < 0) return "amount-expense";
  return "amount-neutral";
}

function formatNetBalance(net) {
  const value = Number(net) || 0;
  if (value === 0) return formatCurrency(0);
  return formatSignedAmount(Math.abs(value), value > 0 ? "income" : "expense");
}

function getMonthKey(dateString) {
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    return dateString.slice(0, 7);
  }

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function formatShortMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

function buildMonthlyReports(transactions) {
  const groups = {};

  for (const transaction of transactions) {
    const key = getMonthKey(transaction.date);
    const type = getTransactionType(transaction);
    const amount = Number(transaction.amount);

    if (!groups[key]) {
      groups[key] = {
        key,
        label: formatMonthLabel(key),
        shortLabel: formatShortMonthLabel(key),
        transactions: [],
        income: 0,
        expenses: 0,
      };
    }

    groups[key].transactions.push(transaction);

    if (type === "income") {
      groups[key].income += amount;
    } else {
      groups[key].expenses += amount;
    }
  }

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const group = groups[key];
      const expensesOnly = group.transactions.filter(
        (transaction) => getTransactionType(transaction) === "expense",
      );

      const largestExpense = expensesOnly.length
        ? expensesOnly.reduce((largest, transaction) =>
            Number(transaction.amount) > Number(largest.amount)
              ? transaction
              : largest,
          )
        : null;

      const categoryTotals = {};
      for (const transaction of expensesOnly) {
        const category = transaction.category || "Other";
        categoryTotals[category] =
          (categoryTotals[category] || 0) + Number(transaction.amount);
      }

      const highestCategoryEntry = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1],
      )[0];
      const net = group.income - group.expenses;

      return {
        key: group.key,
        label: group.label,
        shortLabel: group.shortLabel,
        income: group.income,
        expenses: group.expenses,
        net,
        count: group.transactions.length,
        largestExpense,
        highestCategory: highestCategoryEntry
          ? {
              name: highestCategoryEntry[0],
              amount: highestCategoryEntry[1],
            }
          : null,
      };
    });
}

function buildFinancialSummaryInsights(transactions) {
  const count = transactions.length;

  if (!count) {
    return [
      "Your net balance is $0.00 — add income and expenses to see how you're tracking.",
      "You haven't recorded any income or expenses yet.",
      "There's no largest expense to highlight yet.",
      "No spending category stands out yet.",
      "You've recorded 0 transactions.",
    ];
  }

  let totalIncome = 0;
  let totalExpenses = 0;
  let largestExpense = null;
  const categoryTotals = {};

  for (const transaction of transactions) {
    const type = getTransactionType(transaction);
    const amount = Number(transaction.amount) || 0;

    if (type === "income") {
      totalIncome += amount;
      continue;
    }

    totalExpenses += amount;

    if (!largestExpense || amount > Number(largestExpense.amount)) {
      largestExpense = transaction;
    }

    const category = transaction.category || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  }

  const netBalance = totalIncome - totalExpenses;

  let netInsight;
  if (netBalance > 0) {
    netInsight = `You're earning more than you're spending — your net balance is ${formatNetBalance(netBalance)}.`;
  } else if (netBalance < 0) {
    netInsight = `You're spending more than you're earning — your net balance is ${formatNetBalance(netBalance)}.`;
  } else {
    netInsight = "Your income and expenses are perfectly balanced right now.";
  }

  const incomeVsExpenseInsight =
    totalIncome === 0 && totalExpenses === 0
      ? "You haven't recorded any income or expenses yet."
      : `You've earned ${formatCurrency(totalIncome)} in income versus ${formatCurrency(totalExpenses)} in expenses.`;

  const largestExpenseInsight = largestExpense
    ? `Your largest expense was ${formatCurrency(Number(largestExpense.amount))} on ${
        largestExpense.category || "Other"
      }.`
    : "You haven't recorded any expenses yet.";

  const highestCategoryEntry = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const highestCategoryInsight = highestCategoryEntry
    ? `${highestCategoryEntry[0]} is your highest expense category at ${formatCurrency(highestCategoryEntry[1])}.`
    : "No spending category stands out yet.";

  const countLabel = count === 1 ? "transaction" : "transactions";
  const countInsight = `You've recorded ${count} ${countLabel}.`;

  return [
    netInsight,
    incomeVsExpenseInsight,
    largestExpenseInsight,
    highestCategoryInsight,
    countInsight,
  ];
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [savingEdit, setSavingEdit] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          category: form.category,
          date: form.date,
          type: form.type,
        }),
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

  function startEdit(transaction) {
    setEditingId(transaction.id);
    setEditForm({
      amount: String(transaction.amount),
      category: transaction.category,
      date: transaction.date,
      type: getTransactionType(transaction),
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(initialForm);
  }

  async function handleEditSave(event) {
    event.preventDefault();

    try {
      setSavingEdit(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/transactions/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(editForm.amount),
            category: editForm.category,
            date: editForm.date,
            type: editForm.type,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update transaction.");
      }

      setTransactions((current) =>
        [
          ...current.map((transaction) =>
            transaction.id === editingId ? data : transaction,
          ),
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
      cancelEdit();
    } catch (editError) {
      setError(editError.message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete transaction.");
      }

      if (editingId === id) {
        cancelEdit();
      }

      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id),
      );
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions: transactions.map((transaction) => ({
            ...transaction,
            type: getTransactionType(transaction),
          })),
        }),
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

  const totalIncome = transactions.reduce((sum, transaction) => {
    return getTransactionType(transaction) === "income"
      ? sum + Number(transaction.amount)
      : sum;
  }, 0);

  const totalExpenses = transactions.reduce((sum, transaction) => {
    return getTransactionType(transaction) === "expense"
      ? sum + Number(transaction.amount)
      : sum;
  }, 0);

  const netBalance = totalIncome - totalExpenses;

  const expenseChartData = Object.values(
    transactions
      .filter((transaction) => getTransactionType(transaction) === "expense")
      .reduce((summary, transaction) => {
        const category = transaction.category || "Other";

        if (!summary[category]) {
          summary[category] = { name: category, value: 0 };
        }

        summary[category].value += Number(transaction.amount);
        return summary;
      }, {}),
  );

  const incomeVsExpenseData = [
    {
      name: "Income",
      value: Number(totalIncome.toFixed(2)),
      fill: INCOME_COLOR,
    },
    {
      name: "Expenses",
      value: Number(totalExpenses.toFixed(2)),
      fill: EXPENSE_COLOR,
    },
  ];

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredTransactions = normalizedSearch
    ? transactions.filter((transaction) =>
        (transaction.category || "").toLowerCase().includes(normalizedSearch),
      )
    : transactions;
  const visibleTransactions = sortTransactions(filteredTransactions, sortBy);

  const monthlyReports = buildMonthlyReports(transactions);
  const effectiveMonthKey = monthlyReports.some(
    (report) => report.key === selectedMonthKey,
  )
    ? selectedMonthKey
    : monthlyReports[0]?.key || "";
  const selectedMonthReport =
    monthlyReports.find((report) => report.key === effectiveMonthKey) || null;
  const monthlyTrendData = [...monthlyReports].reverse().map((report) => ({
    month: report.shortLabel,
    income: Number(report.income.toFixed(2)),
    expenses: Number(report.expenses.toFixed(2)),
    net: Number(report.net.toFixed(2)),
  }));

  const financialSummaryInsights = buildFinancialSummaryInsights(transactions);

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="dashboard">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Personal finance dashboard</p>
            <h1>Track income and spending with practical AI guidance.</h1>
            <p className="hero-copy">
              Add income and expenses, review your balance, and generate
              tailored financial advice from your recent transactions.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span>Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>
        </section>

        <section className="summary-cards">
          <div className="stat-card summary-card">
            <span>Total Income</span>
            <strong className="amount-income">
              {formatSignedAmount(totalIncome, "income")}
            </strong>
          </div>
          <div className="stat-card summary-card">
            <span>Total Expenses</span>
            <strong className="amount-expense">
              {formatSignedAmount(totalExpenses, "expense")}
            </strong>
          </div>
          <div className="stat-card summary-card">
            <span>Net Balance</span>
            <strong className={getNetBalanceClass(netBalance)}>
              {formatNetBalance(netBalance)}
            </strong>
          </div>
        </section>

        <section className="panel financial-summary-panel">
          <div className="panel-header">
            <h2>Financial Summary</h2>
            <p>Quick insights calculated from your current transactions.</p>
          </div>

          <ul className="financial-summary-list">
            {financialSummaryInsights.map((insight, index) => (
              <li className="financial-summary-item" key={index}>
                {insight}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid-layout">
          <article className="panel">
            <div className="panel-header">
              <h2>Add Transaction</h2>
              <p>Record income or an expense in seconds.</p>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value })
                  }
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label>
                Amount
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm({ ...form, amount: event.target.value })
                  }
                  placeholder="45.99"
                  required
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  placeholder={form.type === "income" ? "Salary" : "Groceries"}
                  required
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                  required
                />
              </label>

              <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Add transaction"}
              </button>
            </form>
          </article>

          <article className="panel chart-panel">
            <div className="panel-header">
              <h2>Spending by category</h2>
              <p>Your expense category split updates automatically.</p>
            </div>

            <div className="chart-wrapper">
              {expenseChartData.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  Add expenses to see your spending chart.
                </div>
              )}
            </div>

            <div className="category-legend">
              {expenseChartData.map((item, index) => (
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

        <section className="panel income-expense-panel">
          <div className="panel-header">
            <h2>Income vs Expense</h2>
            <p>Compare total money in against total money out.</p>
          </div>

          <div className="chart-wrapper bar-chart-wrapper">
            {totalIncome > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={incomeVsExpenseData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(148, 163, 184, 0.18)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    width={56}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                    {incomeVsExpenseData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                Add an income transaction to compare income and expenses.
              </div>
            )}
          </div>
        </section>

        <section className="panel monthly-reports-panel">
          <div className="panel-header monthly-reports-header">
            <div>
              <h2>Monthly reports</h2>
              <p>Income and expense summaries grouped by month and year.</p>
            </div>

            {monthlyReports.length ? (
              <label className="month-selector" htmlFor="month-report-select">
                Month
                <select
                  id="month-report-select"
                  value={effectiveMonthKey}
                  onChange={(event) => setSelectedMonthKey(event.target.value)}
                >
                  {monthlyReports.map((report) => (
                    <option key={report.key} value={report.key}>
                      {report.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {selectedMonthReport ? (
            <>
              <div className="monthly-report-card">
                <div className="monthly-report-stats">
                  <div className="stat-card">
                    <span>Monthly Income</span>
                    <strong className="amount-income">
                      {formatSignedAmount(selectedMonthReport.income, "income")}
                    </strong>
                  </div>
                  <div className="stat-card">
                    <span>Monthly Expenses</span>
                    <strong className="amount-expense">
                      {formatSignedAmount(
                        selectedMonthReport.expenses,
                        "expense",
                      )}
                    </strong>
                  </div>
                  <div className="stat-card">
                    <span>Monthly Net Balance</span>
                    <strong
                      className={getNetBalanceClass(selectedMonthReport.net)}
                    >
                      {formatNetBalance(selectedMonthReport.net)}
                    </strong>
                  </div>
                  <div className="stat-card">
                    <span>Transactions</span>
                    <strong>{selectedMonthReport.count}</strong>
                  </div>
                  <div className="stat-card">
                    <span>Largest expense</span>
                    <strong className="amount-expense">
                      {selectedMonthReport.largestExpense
                        ? formatSignedAmount(
                            selectedMonthReport.largestExpense.amount,
                            "expense",
                          )
                        : "—"}
                    </strong>
                    <p>
                      {selectedMonthReport.largestExpense?.category ||
                        "No expenses"}
                    </p>
                  </div>
                  <div className="stat-card">
                    <span>Highest category</span>
                    <strong>
                      {selectedMonthReport.highestCategory?.name || "—"}
                    </strong>
                    <p>
                      {selectedMonthReport.highestCategory ? (
                        <span className="amount-expense">
                          {formatSignedAmount(
                            selectedMonthReport.highestCategory.amount,
                            "expense",
                          )}
                        </span>
                      ) : (
                        "No expenses"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="monthly-trend">
                <div className="panel-header">
                  <h3>Monthly income & expense trend</h3>
                  <p>
                    Compare money in and out across months with transactions.
                  </p>
                </div>

                <div className="chart-wrapper trend-chart-wrapper">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart
                      data={monthlyTrendData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="monthlyIncomeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4ade80"
                            stopOpacity={0.45}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4ade80"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                        <linearGradient
                          id="monthlyExpenseGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f87171"
                            stopOpacity={0.45}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f87171"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(148, 163, 184, 0.18)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value}`}
                        width={56}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(value),
                          name === "income"
                            ? "Income"
                            : name === "expenses"
                              ? "Expenses"
                              : "Net",
                        ]}
                        contentStyle={{
                          background: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(148, 163, 184, 0.25)",
                          borderRadius: "12px",
                          color: "#f8fafc",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#4ade80"
                        strokeWidth={2.5}
                        fill="url(#monthlyIncomeGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#f87171"
                        strokeWidth={2.5}
                        fill="url(#monthlyExpenseGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              Add transactions to unlock monthly income and expense reports.
            </div>
          )}
        </section>

        <section className="grid-layout lower-grid">
          <article className="panel transactions-panel">
            <div className="panel-header">
              <h2>Transactions</h2>
              <p>Recent income and expenses across all categories.</p>
            </div>

            <div className="transaction-toolbar">
              <label htmlFor="transaction-search">
                Search by category
                <input
                  id="transaction-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="e.g. groceries"
                  autoComplete="off"
                />
              </label>

              <label htmlFor="transaction-sort">
                Sort by
                <select
                  id="transaction-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="empty-state">Loading transactions...</div>
            ) : !transactions.length ? (
              <div className="empty-state">
                No transactions yet. Add your first transaction.
              </div>
            ) : visibleTransactions.length ? (
              <div className="transaction-list">
                {visibleTransactions.map((transaction) =>
                  editingId === transaction.id ? (
                    <form
                      className="transaction-edit-form"
                      key={transaction.id}
                      onSubmit={handleEditSave}
                    >
                      <label>
                        Type
                        <select
                          value={editForm.type}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              type: event.target.value,
                            })
                          }
                          required
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </label>
                      <label>
                        Amount
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              amount: event.target.value,
                            })
                          }
                          required
                        />
                      </label>
                      <label>
                        Category
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              category: event.target.value,
                            })
                          }
                          required
                        />
                      </label>
                      <label>
                        Date
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              date: event.target.value,
                            })
                          }
                          required
                        />
                      </label>
                      <div className="edit-actions">
                        <button
                          className="save-button"
                          type="submit"
                          disabled={savingEdit}
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="cancel-button"
                          type="button"
                          onClick={cancelEdit}
                          disabled={savingEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="transaction-row" key={transaction.id}>
                      <div>
                        <strong>{transaction.category}</strong>
                        <p>
                          {new Date(transaction.date).toLocaleDateString()}
                          <span
                            className={`type-badge type-badge-${getTransactionType(transaction)}`}
                          >
                            {getTransactionType(transaction)}
                          </span>
                        </p>
                      </div>
                      <div className="transaction-actions">
                        <span
                          className={
                            getTransactionType(transaction) === "income"
                              ? "amount-income"
                              : "amount-expense"
                          }
                        >
                          {formatSignedAmount(
                            transaction.amount,
                            getTransactionType(transaction),
                          )}
                        </span>
                        <button
                          className="edit-button"
                          type="button"
                          onClick={() => startEdit(transaction)}
                          disabled={deletingId === transaction.id}
                          aria-label={`Edit ${transaction.category} transaction`}
                        >
                          Edit
                        </button>
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
                  ),
                )}
              </div>
            ) : (
              <div className="empty-state">
                No transactions match &ldquo;{searchQuery.trim()}&rdquo;. Try
                another category.
              </div>
            )}
          </article>

          <article className="panel analysis-panel">
            <div className="panel-header">
              <h2>AI financial advice</h2>
              <p>Generate a summary based on your income and spending.</p>
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
              {advice ||
                "Your personalized advice will appear here after analysis."}
            </div>
          </article>
        </section>

        {error ? <div className="error-banner">{error}</div> : null}
      </main>
    </div>
  );
}

export default App;
