"use client";

import Navbar from "@/component/Navbar";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { GoHome, GoTag } from "react-icons/go";
import { PiCarProfile, PiSuitcase } from "react-icons/pi";
import { IoMdTrendingUp } from "react-icons/io";

type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: {
    _id: string;
    name: string;
    icon: string;
  } | null;
  date: string;
  note: string;
};

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  

  const iconMap: Record<string, any> = {
    shopping: FiShoppingBag,
    transport: PiCarProfile,
    rent: GoHome,
    salary: FiDollarSign,
    freelance: PiSuitcase,
    investment: IoMdTrendingUp,
    other: GoTag,
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
          credentials: "include",
        });

        const data = await res.json();

        setTransactions(data?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="px-4 mt-6 pb-28 min-h-screen">
      <main>
        {/* Search */}
        <div className="bg-gray-300/20 py-3 px-4 w-full rounded-lg flex items-center gap-x-2">
          <LuSearch />
          <input
            type="search"
            className="w-full outline-none bg-transparent"
            placeholder="Search transaction..."
          />
        </div>

        {/* Transactions */}
        <div className="mt-6 space-y-4">
          {(transactions ?? []).map((transaction) => {
            const iconKey = transaction.category?.icon ?? "other";
            const Icon = iconMap[iconKey];

            return (
              <div
                key={transaction._id}
                className="bg-white border rounded-xl p-4 flex items-start justify-between"
              >
                {/* LEFT SIDE */}
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-3 ${
                      transaction.type === "income"
                        ? "text-green-600 bg-green-100"
                        : "text-red-500 bg-red-100"
                    }`}
                  >
                    {Icon && <Icon className="text-xl" />}
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      {transaction.category?.name ?? "Unknown Category"}
                    </h2>

                    <p className="font-medium text-sm text-gray-600">
                      {transaction.note || "No note"}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <button>
                        {new Date(transaction.date).toLocaleDateString()}
                      </button>

                      <button
                        className={`capitalize rounded-full py-1 px-3 text-xs ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {transaction.type}
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div>
                  <p
                    className={`font-bold text-xl ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    ₦{transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Navbar />
    </div>
  );
}