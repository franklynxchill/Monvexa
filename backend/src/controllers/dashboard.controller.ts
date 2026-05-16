import { Request, Response } from "express";
import Transaction from "../models/transaction.model";
import Category from "../models/category.model";

// ===============================
// HELPER: % CHANGE CALCULATOR
// ===============================
const calculateChange = (
  current: number,
  previous: number
) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(
    ((current - previous) / Math.abs(previous)) * 100
  );
};

// ===============================
// GET DASHBOARD DATA
// ===============================
export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // =========================
    // FETCH TRANSACTIONS
    // =========================
    const transactions = await Transaction.find({
      userId,
    })
      .populate("category")
      .sort({ createdAt: -1 });

    // =========================
    // TOTAL INCOME / EXPENSE
    // =========================
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    const balance = income - expense;

    // =========================
    // TODAY
    // =========================
    const today = new Date();

    const todayTransactions = transactions.filter(
      (t) => {
        const d = new Date(t.date);

        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      }
    );

    const todayIncome = todayTransactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const todayExpense = todayTransactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    const todayProfit =
      todayIncome - todayExpense;

    // =========================
    // YESTERDAY
    // =========================
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const yesterdayTransactions =
      transactions.filter((t) => {
        const d = new Date(t.date);

        return (
          d.getDate() === yesterday.getDate() &&
          d.getMonth() === yesterday.getMonth() &&
          d.getFullYear() ===
            yesterday.getFullYear()
        );
      });

    const yesterdayIncome =
      yesterdayTransactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);

    const yesterdayExpense =
      yesterdayTransactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);

    const yesterdayProfit =
      yesterdayIncome - yesterdayExpense;

    const todayChange = calculateChange(
      todayProfit,
      yesterdayProfit
    );

    // =========================
    // WEEKLY
    // =========================
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      today.getDate() - 7
    );

    const weeklyTransactions =
      transactions.filter(
        (t) =>
          new Date(t.date) >= sevenDaysAgo
      );

    const weeklyIncome =
      weeklyTransactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);

    const weeklyExpense =
      weeklyTransactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);

    const weeklyProfit =
      weeklyIncome - weeklyExpense;

    // =========================
    // PREVIOUS WEEK
    // =========================
    const prevWeekStart = new Date();

    prevWeekStart.setDate(
      today.getDate() - 14
    );

    const prevWeekEnd = new Date();

    prevWeekEnd.setDate(
      today.getDate() - 7
    );

    const prevWeekTransactions =
      transactions.filter((t) => {
        const d = new Date(t.date);

        return (
          d >= prevWeekStart &&
          d < prevWeekEnd
        );
      });

    const prevWeekIncome =
      prevWeekTransactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);

    const prevWeekExpense =
      prevWeekTransactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);

    const prevWeekProfit =
      prevWeekIncome - prevWeekExpense;

    const weeklyChange =
      calculateChange(
        weeklyProfit,
        prevWeekProfit
      );

    // =========================
    // MONTHLY
    // =========================
    const currentMonth =
      today.getMonth();

    const currentYear =
      today.getFullYear();

    const monthlyTransactions =
      transactions.filter((t) => {
        const d = new Date(t.date);

        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      });

    const monthlyIncome =
      monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);

    const monthlyExpense =
      monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);

    const monthlyProfit =
      monthlyIncome - monthlyExpense;

    // =========================
    // PREVIOUS MONTH
    // =========================
    const prevMonthDate = new Date(
      currentYear,
      currentMonth - 1,
      1
    );

    const prevMonthTransactions =
      transactions.filter((t) => {
        const d = new Date(t.date);

        return (
          d.getMonth() ===
            prevMonthDate.getMonth() &&
          d.getFullYear() ===
            prevMonthDate.getFullYear()
        );
      });

    const prevMonthIncome =
      prevMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);

    const prevMonthExpense =
      prevMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);

    const prevMonthProfit =
      prevMonthIncome - prevMonthExpense;

    const monthlyChange =
      calculateChange(
        monthlyProfit,
        prevMonthProfit
      );

    // =========================
    // TOTAL TRANSACTIONS
    // =========================
    const totalTransactions =
      await Transaction.countDocuments({
        userId,
      });

    // =========================
    // TOTAL CATEGORIES
    // =========================
    const totalCategories =
      await Category.countDocuments({
        userId,
      });

    // =========================
    // TOTAL MONTHS ACTIVE
    // =========================
    const oldestTransaction =
      await Transaction.findOne({
        userId,
      }).sort({
        createdAt: 1,
      });

    let totalMonths = 0;

    if (oldestTransaction) {
      const startDate = new Date(
        oldestTransaction.createdAt
      );

      const currentDate = new Date();

      totalMonths =
        (currentDate.getFullYear() -
          startDate.getFullYear()) *
          12 +
        (currentDate.getMonth() -
          startDate.getMonth()) +
        1;
    }

    // =========================
    // RESPONSE
    // =========================
    res.status(200).json({
      summary: {
        balance,
        income,
        expense,
      },

      profitMetrics: {
        today: {
          amount: todayProfit,
          change: todayChange,
        },

        weekly: {
          amount: weeklyProfit,
          change: weeklyChange,
        },

        monthly: {
          amount: monthlyProfit,
          change: monthlyChange,
        },
      },

      weeklyStats: {
        income: weeklyIncome,
        expense: weeklyExpense,

        incomePercentage:
          weeklyIncome + weeklyExpense >
          0
            ? Math.round(
                (weeklyIncome /
                  (weeklyIncome +
                    weeklyExpense)) *
                  100
              )
            : 0,

        expensePercentage:
          weeklyIncome + weeklyExpense >
          0
            ? Math.round(
                (weeklyExpense /
                  (weeklyIncome +
                    weeklyExpense)) *
                  100
              )
            : 0,
      },

      stats: {
        totalTransactions,
        totalCategories,
        totalMonths,
      },

      recentTransactions:
        transactions.slice(0, 5),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};