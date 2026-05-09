import { Request, Response } from "express";
import Transaction from "../models/transaction.model";

export const getInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactions = await Transaction.find({ userId }).populate("category");

    // =========================
    // TOTALS
    // =========================
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // =========================
    // EXPENSE BREAKDOWN
    // =========================
    const expenseMap: Record<string, number> = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t: any) => {
        const cat = t.category?.name || "Others";
        expenseMap[cat] = (expenseMap[cat] || 0) + t.amount;
      });

    const expenseBreakdown = Object.entries(expenseMap).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense
          ? Math.round((Number(amount) / totalExpense) * 100)
          : 0,
      })
    );

    // =========================
    // INCOME SOURCES
    // =========================
    const incomeMap: Record<string, number> = {};

    transactions
      .filter((t) => t.type === "income")
      .forEach((t: any) => {
        const cat = t.category?.name || "Others";
        incomeMap[cat] = (incomeMap[cat] || 0) + t.amount;
      });

    const incomeSources = Object.entries(incomeMap).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage: totalIncome
          ? Math.round((Number(amount) / totalIncome) * 100)
          : 0,
      })
    );

    // =========================
    // MONTHLY TREND
    // =========================
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const monthlyTrend = months.map((month, i) => {
      const filtered = transactions.filter(
        (t: any) => new Date(t.date).getMonth() === i
      );

      return {
        month,
        income: filtered.filter(t => t.type === "income")
          .reduce((s, t) => s + t.amount, 0),

        expense: filtered.filter(t => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0),
      };
    });

    // =========================
    // WEEK HELPERS
    // =========================
    const now = new Date();

    const startOfWeek = (date: Date, offsetWeeks = 0) => {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day - offsetWeeks * 7);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const endOfWeek = (start: Date) => {
      const d = new Date(start);
      d.setDate(d.getDate() + 6);
      return d;
    };

    const getWeekData = (label: string, offset: number) => {
      const start = startOfWeek(now, offset);
      const end = endOfWeek(start);

      const weekTx = transactions.filter((t: any) => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });

      const income = weekTx
        .filter(t => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);

      const expense = weekTx
        .filter(t => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

      return {
        period: label,
        income,
        expense,
        profit: income - expense,
      };
    };

    // =========================
    // PROFIT TREND (W1–W4 LINE GRAPH)
    // =========================
    const profitTrend = [
      getWeekData("W1", 3),
      getWeekData("W2", 2),
      getWeekData("W3", 1),
      getWeekData("W4", 0),
    ];

    // =========================
    // WEEKLY COMPARISON (BAR GRAPH)
    // =========================
    const thisWeekStart = startOfWeek(now, 0);
    const lastWeekStart = startOfWeek(now, 1);
    const lastWeekEnd = endOfWeek(lastWeekStart);

    const thisWeekTx = transactions.filter((t: any) => {
      const d = new Date(t.date);
      return d >= thisWeekStart && d <= now;
    });

    const lastWeekTx = transactions.filter((t: any) => {
      const d = new Date(t.date);
      return d >= lastWeekStart && d <= lastWeekEnd;
    });

    const sumType = (arr: any[], type: string) =>
      arr.filter(t => t.type === type)
        .reduce((s, t) => s + t.amount, 0);

    const weeklyComparison = [
      {
        period: "Last Week",
        income: sumType(lastWeekTx, "income"),
        expense: sumType(lastWeekTx, "expense"),
      },
      {
        period: "This Week",
        income: sumType(thisWeekTx, "income"),
        expense: sumType(thisWeekTx, "expense"),
      },
    ];

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      expenseBreakdown,
      incomeSources,
      monthlyTrend,
      profitTrend,
      weeklyComparison,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};