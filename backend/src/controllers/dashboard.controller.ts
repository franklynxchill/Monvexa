// controllers/dashboard.controller.ts

import { Request, Response } from "express";
import Transaction from "../models/transaction.model";

// ===============================
// GET DASHBOARD DATA
// ===============================
export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    // =====================================
    // GET LOGGED IN USER ID
    // =====================================
    const userId = req.user?.userId;

    // If user is not authenticated
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // =====================================
    // FETCH USER TRANSACTIONS
    // =====================================
    // populate("category")
    // allows us access:
    // transaction.category.name
    // transaction.category.icon
    const transactions = await Transaction.find({
      userId,
    })
      .populate("category")
      .sort({ createdAt: -1 });

    // =====================================
    // CALCULATE TOTAL INCOME
    // =====================================
    // filter() -> gets only income transactions
    // reduce() -> sums all amounts together
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    // =====================================
    // CALCULATE TOTAL EXPENSE
    // =====================================
    const expense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    // =====================================
    // BALANCE
    // =====================================
    // money remaining
    const balance = income - expense;

    // =====================================
    // RECENT TRANSACTIONS
    // =====================================
    // show latest 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    // =====================================
    // TODAY'S PROFIT
    // =====================================
    // current date
    const today = new Date();

    // get transactions created today
    const todayTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    });

    // today's income
    const todayIncome = todayTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    // today's expense
    const todayExpense = todayTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    // today's profit
    const todayProfit = todayIncome - todayExpense;

    // =====================================
    // WEEKLY DATA
    // =====================================
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 7);

    // get transactions within 7 days
    const weeklyTransactions = transactions.filter(
      (transaction) =>
        new Date(transaction.date) >= sevenDaysAgo
    );

    // weekly income
    const weeklyIncome = weeklyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    // weekly expense
    const weeklyExpense = weeklyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    // weekly profit
    const weeklyProfit = weeklyIncome - weeklyExpense;

    // =====================================
    // MONTHLY DATA
    // =====================================
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyTransactions = transactions.filter(
      (transaction) => {
        const transactionDate = new Date(transaction.date);

        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      }
    );

    const monthlyIncome = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    const monthlyExpense = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    const monthlyProfit =
      monthlyIncome - monthlyExpense;

    // =====================================
    // TOP EXPENSE CATEGORY
    // =====================================

    // object to store category totals
    const expenseMap: any = {};

    // loop through expense transactions
    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction: any) => {
        const categoryName =
          transaction.category?.name || "Other";

        // create if not existing
        if (!expenseMap[categoryName]) {
          expenseMap[categoryName] = 0;
        }

        // add amount
        expenseMap[categoryName] += transaction.amount;
      });

    // convert object into array
    const expenseEntries = Object.entries(expenseMap);

    // sort highest first
    expenseEntries.sort(
      (a: any, b: any) => b[1] - a[1]
    );

    // first item = highest expense category
    const topExpense = expenseEntries[0];

    // =====================================
    // TOP INCOME CATEGORY
    // =====================================
    const incomeMap: any = {};

    transactions
      .filter((transaction) => transaction.type === "income")
      .forEach((transaction: any) => {
        const categoryName =
          transaction.category?.name || "Other";

        if (!incomeMap[categoryName]) {
          incomeMap[categoryName] = 0;
        }

        incomeMap[categoryName] += transaction.amount;
      });

    const incomeEntries = Object.entries(incomeMap);

    incomeEntries.sort(
      (a: any, b: any) => b[1] - a[1]
    );

    const topIncome = incomeEntries[0];

    // =====================================
    // PERCENTAGES
    // =====================================
    const topExpensePercentage =
      expense > 0
        ? Math.round((Number(topExpense?.[1]) / expense) * 100)
        : 0;

    const topIncomePercentage =
      income > 0
        ? Math.round((Number(topIncome?.[1]) / income) * 100)
        : 0;

    
    // =====================================
    // FINAL RESPONSE
    // =====================================
    res.status(200).json({
      summary: {
        balance,
        income,
        expense,
      },

      profitMetrics: {
        today: {
          amount: todayProfit,
          change: 12,
        },

        weekly: {
          amount: weeklyProfit,
          change: 8,
        },

        monthly: {
          amount: monthlyProfit,
          change: 15,
        },
      },

      weeklyStats: {
        income: weeklyIncome,
        expense: weeklyExpense,

        incomePercentage:
          weeklyIncome + weeklyExpense > 0
            ? Math.round(
                (weeklyIncome /
                  (weeklyIncome + weeklyExpense)) *
                  100
              )
            : 0,

        expensePercentage:
          weeklyIncome + weeklyExpense > 0
            ? Math.round(
                (weeklyExpense /
                  (weeklyIncome + weeklyExpense)) *
                  100
              )
            : 0,
      },

      insights: {
        topExpense: {
          category: topExpense?.[0] || "None",
          amount: topExpense?.[1] || 0,
          percentage: topExpensePercentage,
        },

        topIncome: {
          category: topIncome?.[0] || "None",
          amount: topIncome?.[1] || 0,
          percentage: topIncomePercentage,
        },
      },

      recentTransactions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};