"use client";

import Navbar from "@/component/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineArrowOutward } from "react-icons/md";

type DashboardData = {
  summary?: {
    balance?: number;
    income?: number;
    expense?: number;
  };

  profitMetrics?: {
    today?: { amount?: number; change?: number };
    weekly?: { amount?: number; change?: number };
    monthly?: { amount?: number; change?: number };
  };

  weeklyStats?: {
    income?: number;
    expense?: number;
    incomePercentage?: number;
    expensePercentage?: number;
  };

  insights?: {
    topExpense?: { category?: string; amount?: number; percentage?: number };
    topIncome?: { category?: string; amount?: number; percentage?: number };
  };

  recentTransactions?: any[];
};

export default function Page() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  // FORMAT MONEY
  const formatAmount = (amount?: number) => {
    if (amount === undefined || amount === null) return "₦0";

    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}K`;

    return `₦${amount.toLocaleString()}`;
  };

  // FORMAT PERCENTAGE
  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return "0%";
    return `${value > 0 ? "+" : ""}${value}%`;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
          { credentials: "include" }
        );

        const data = await res.json();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) return <p className="mt-10 px-4">Loading...</p>;

  const today = dashboard.profitMetrics?.today;
  const weekly = dashboard.profitMetrics?.weekly;
  const monthly = dashboard.profitMetrics?.monthly;
  const weeklyStats = dashboard.weeklyStats;
  const insights = dashboard.insights;

  return (
    <div className="px-4 pb-28 min-h-screen">
      <main className="mt-4">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's your financial overview
          </p>
        </div>

        {/* TODAY */}
        <div className="mt-8 bg-primary text-white rounded-3xl p-6">

          <div className="flex items-center justify-between">
            <p className="text-white/80">Today's Profit</p>

            <div
              className={`px-5 py-1.5 rounded-full flex items-center gap-x-1 text-sm ${
                (today?.change ?? 0) >= 0
                  ? "bg-white/20 text-green-200"
                  : "bg-white/20 text-red-200"
              }`}
            >
              {(today?.change ?? 0) >= 0 ? (
                <IoMdTrendingUp />
              ) : (
                <MdOutlineArrowOutward className="rotate-180" />
              )}

              {formatPercentage(today?.change)}
            </div>
          </div>

          <h2 className="text-4xl font-bold mt-3">
            {formatAmount(today?.amount)}
          </h2>

          <p 
            className="mt-5 text-sm text-white/80"
          > {new Date().toLocaleDateString("en-NG", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            })}   
          </p>
        </div>

        {/* WEEKLY + MONTHLY */}
        <div className="flex gap-4 mt-6">

          {/* WEEKLY */}
          <div className="flex-1 bg-white border rounded-2xl p-4">
            <p className="text-gray-500 text-sm">Weekly Profit</p>

            <h2 className="text-xl font-bold mt-4">
              {formatAmount(weekly?.amount)}
            </h2>

            <p
              className={`font-semibold mt-2 flex items-center gap-x-1 ${
                (weekly?.change ?? 0) >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {(weekly?.change ?? 0) >= 0 ? (
                <IoMdTrendingUp />
              ) : (
                <MdOutlineArrowOutward className="rotate-180" />
              )}

              {formatPercentage(weekly?.change)}
            </p>
          </div>

          {/* MONTHLY */}
          <div className="flex-1 bg-white border rounded-2xl p-4">
            <p className="text-gray-500 text-sm">Monthly Profit</p>

            <h2 className="text-xl font-bold mt-4">
              {formatAmount(monthly?.amount)}
            </h2>

            <p
              className={`font-semibold mt-2 flex items-center gap-x-1 ${
                (monthly?.change ?? 0) >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {(monthly?.change ?? 0) >= 0 ? (
                <IoMdTrendingUp />
              ) : (
                <MdOutlineArrowOutward className="rotate-180" />
              )}

              {formatPercentage(monthly?.change)}
            </p>
          </div>
        </div>

        {/* WEEKLY STATS */}
        <div className="my-7 bg-white rounded-2xl border p-5">

          <h2 className="text-lg font-bold mb-6">This Week</h2>

          {/* INCOME */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <p>Income</p>
              <p className="text-green-600 font-bold">
                ₦{weeklyStats?.income?.toLocaleString() ?? 0}
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{
                  width: `${weeklyStats?.incomePercentage ?? 0}%`,
                }}
              />
            </div>
          </div>

          {/* EXPENSE */}
          <div>
            <div className="flex justify-between mb-2">
              <p>Expense</p>
              <p className="text-red-500 font-bold">
                ₦{weeklyStats?.expense?.toLocaleString() ?? 0}
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{
                  width: `${weeklyStats?.expensePercentage ?? 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* QUICK INSIGHTS */}
        <div className="border rounded-2xl p-5 bg-white">

          <h2>Quick Insights</h2>

          <div className="space-y-3 mt-4">

            {/* TOP EXPENSE */}
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Top Expense</p>
                <h2 className="font-medium">
                  {insights?.topExpense?.category ?? "N/A"}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-red-500 font-semibold">
                  ₦{insights?.topExpense?.amount?.toLocaleString() ?? 0}
                </p>
                <p className="text-sm">
                  {insights?.topExpense?.percentage ?? 0}% of total
                </p>
              </div>
            </div>

            {/* TOP INCOME */}
            <div className="flex justify-between border-t pt-4">
              <div>
                <p className="text-gray-500">Top Income</p>
                <h2 className="font-medium">
                  {insights?.topIncome?.category ?? "N/A"}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-semibold">
                  ₦{insights?.topIncome?.amount?.toLocaleString() ?? 0}
                </p>
                <p className="text-sm">
                  {insights?.topIncome?.percentage ?? 0}% of total
                </p>
              </div>
            </div>

          </div>

          <Link
            href="/insights"
            className="text-primary font-semibold mt-5 flex items-center justify-center gap-x-2"
          >
            View detailed analytics
            <MdOutlineArrowOutward className="text-xl" />
          </Link>
        </div>

        {/* FLOATING BUTTON */}
        <div className="fixed bottom-24 right-4">
          <Link
            href="/new-transaction"
            className="bg-primary text-white p-4 rounded-full flex items-center justify-center shadow-lg"
          >
            <FiPlus className="text-2xl" />
          </Link>
        </div>

      </main>

      <Navbar />
    </div>
  );
}