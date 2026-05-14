"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { GoHome, GoTag } from "react-icons/go";
import { PiCarProfile, PiSuitcase } from "react-icons/pi";
import { IoMdTrendingUp } from "react-icons/io";

type Category = {
  _id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
};

export default function Page() {
  const router = useRouter();

  const [transactionData, setTransactionData] = useState({
    amount: "",
    type: "expense",
    category: "",
    note: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const iconMap: any = {
    shopping: FiShoppingBag,
    transport: PiCarProfile,
    rent: GoHome,
    salary: FiDollarSign,
    freelance: PiSuitcase,
    investment: IoMdTrendingUp,
    other: GoTag,
  };

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          credentials: "include",
        });

        const data = await res.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Input handler (ONLY inputs)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Category handler (FIXED)
  const handleCategorySelect = (categoryId: string) => {
    setTransactionData((prev) => ({
      ...prev,
      category: categoryId,
    }));
  };

  // ✅ Submit transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !transactionData.amount ||
      !transactionData.type ||
      !transactionData.category
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        amount: Number(transactionData.amount),
        type: transactionData.type,
        category: transactionData.category,
        note: transactionData.note,
        date: new Date().toISOString(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend Error:", data.message);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 mt-6 mb-16">
      <main>
        {/* Header */}
        <div className="flex items-center ">
          <div className=" absolute top-7 left-5">
            <Link href="/dashboard">
              <IoClose className="text-3xl" />
            </Link>
          </div>
          <h2 className="text-center text-xl font-bold">
            Add Transaction
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="flex flex-col items-center my-9">
            <label>Amount</label>
            <div className="flex items-center justify-center gap-2">
              {/* <FiDollarSign className="text-5xl" /> */}
              <p className="text-5xl" >₦</p>
              <input
                type="number"
                name="amount"
                value={transactionData.amount}
                onChange={handleChange}
                className="outline-none w-1/2 text-center text-6xl"
                placeholder="0"
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                setTransactionData((prev) => ({
                  ...prev,
                  type: "expense",
                }))
              }
              className={`flex-1 border-2 rounded-xl py-4 cursor-pointer ${
                transactionData.type === "expense"
                  ? "bg-red-500 text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() =>
                setTransactionData((prev) => ({
                  ...prev,
                  type: "income",
                }))
              }
              className={`flex-1 border-2 rounded-xl py-4 cursor-pointer ${
                transactionData.type === "income"
                  ? "bg-green-500 text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              Income
            </button>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <h3 className="font-semibold">Category</h3>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {categories
                .filter((cat) => cat.type === transactionData.type)
                .map((item) => {
                  const Icon = iconMap[item.icon];

                  return (
                    <div
                      key={item._id}
                      onClick={() => handleCategorySelect(item._id)}
                      className={`border-2 bg-white font-medium rounded-xl py-4 text-center cursor-pointer flex flex-col items-center gap-2 ${
                        transactionData.category === item._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      {Icon && <Icon className="text-2xl" />}
                      <p>{item.name}</p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Note */}
          <div className="my-6">
            <label className="block mb-1">Note (Optional)</label>
            <input
              type="text"
              name="note"
              value={transactionData.note}
              onChange={handleChange}
              className="w-full py-4 px-4 border-2 rounded-xl"
              placeholder="Add a note..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white text-lg py-4 w-full rounded-xl cursor-pointer"
          >
            {isLoading ? "Saving..." : "Save Transaction"}
          </button>
        </form>
      </main>
    </div>
  );
}