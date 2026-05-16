"use client";

import Navbar from "@/component/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CiCalendar } from "react-icons/ci";
import { FiEdit, FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import {
  LuCreditCard,
  LuDatabase,
  LuLogOut,
} from "react-icons/lu";

type User = {
  _id?: string;
  fullName: string;
  email: string;
  createdAt?: string;
};

type Stats = {
  totalTransactions: number;
  totalCategories: number;
  totalMonths: number;
};

function Page() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // FETCH USER + STATS
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        setUser(data.user || data);
        setStats(data.stats || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 mt-6 mb-36 animate-pulse">

        {/* PROFILE CARD SKELETON */}
        <div className="bg-primary/10 rounded-2xl p-5 border">

          <div className="flex items-start justify-between">

            {/* USER INFO */}
            <div className="flex items-center gap-x-3">

              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-gray-300" />

              <div>
                <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-300 rounded" />
              </div>
            </div>

            {/* EDIT BUTTON */}
            <div className="w-8 h-8 bg-gray-300 rounded-lg" />
          </div>

          {/* MEMBER SINCE */}
          <div className="h-4 w-40 bg-gray-300 rounded mt-5" />
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white rounded-2xl border-2 mt-6 p-4">

          <div className="h-5 w-40 bg-gray-300 rounded mb-6" />

          {/* EMAIL */}
          <div className="flex items-center gap-x-3 py-3">
            <div className="w-6 h-6 bg-gray-300 rounded" />
            <div>
              <div className="h-3 w-16 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-52 bg-gray-300 rounded" />
            </div>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-x-3 py-3">
            <div className="w-6 h-6 bg-gray-300 rounded" />
            <div>
              <div className="h-3 w-16 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-36 bg-gray-300 rounded" />
            </div>
          </div>

        </div>

        {/* SUBSCRIPTION */}
        <div className="bg-white rounded-2xl border-2 mt-5 p-4">

          <div className="h-5 w-32 bg-gray-300 rounded mb-6" />

          <div className="flex justify-between items-center">
            <div>
              <div className="h-3 w-20 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-300 rounded" />
            </div>

            <div className="w-6 h-6 bg-gray-300 rounded" />
          </div>

          <div className="h-10 w-full bg-gray-300 rounded mt-4" />
        </div>

        {/* DATA */}
        <div className="bg-white rounded-2xl border-2 mt-5 p-4">

          <div className="flex justify-between items-center py-3">
            <div className="flex gap-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded" />
              <div>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-36 bg-gray-300 rounded" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t">
            <div className="flex gap-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded" />
              <div>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-36 bg-gray-300 rounded" />
              </div>
            </div>
          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mt-6">

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border-2 rounded-xl py-6 text-center"
            >
              <div className="h-8 w-10 bg-gray-300 rounded mx-auto mb-3" />
              <div className="h-3 w-16 bg-gray-300 rounded mx-auto" />
            </div>
          ))}

        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-8 h-12 bg-gray-300 rounded-xl" />

      </div>
    );
  }

  return (
    <div className="px-4 mt-6 mb-36">
      {/* PROFILE CARD */}
      <div className="bg-primary rounded-2xl p-5 text-white">

        <div className="flex items-start justify-between">
          
          <div className="flex items-center gap-x-3">
            {/* AVATAR */}
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold uppercase">
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            {/* USER INFO */}
            <div>
              <h2 className="text-xl font-bold capitalize">
                {user?.fullName}
              </h2>
              <p className="text-white/80 mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          <button className="bg-white/20 p-2 rounded-lg">
            <FiEdit className="text-xl" />
          </button>
        </div>

        {/* MEMBER SINCE */}
        <div className="flex items-center gap-x-2 text-white/90 mt-5">
          <CiCalendar className="text-xl" />

          <p className="text-sm">
            Member since{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString(
                  "en-NG",
                  {
                    year: "numeric",
                    month: "long",
                  }
                )
              : "N/A"}
          </p>
        </div>
      </div>

      {/* ACCOUNT INFO */}
      <div className="bg-white rounded-2xl border-2 mt-6">
        <h2 className="font-bold p-4">
          Account Information
        </h2>

        <div className="border-y-2 flex items-center gap-x-3 py-4 px-4">
          <HiOutlineMail className="text-2xl text-muted-foreground" />
          <div>
            <label className="text-sm text-gray-500">
              Email
            </label>
            <p className="font-semibold">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-3 py-4 px-4">
          <FiPhone className="text-2xl text-muted-foreground" />
          <div>
            <label className="text-sm text-gray-500">
              Phone
            </label>
            <p>Not added yet</p>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION */}
      <div className="bg-white rounded-2xl border-2 mt-5">
        <h2 className="font-bold p-4">
          Subscription
        </h2>

        <div className="border-t flex items-center justify-between py-4 px-4">
          <div>
            <label className="text-sm text-gray-500">
              Current Plan
            </label>
            <p className="font-semibold">
              Free Plan
            </p>
          </div>

          <LuCreditCard className="text-2xl text-muted-foreground" />
        </div>

        <div className="p-4 border-t">
          <button className="w-full py-3 rounded-xl bg-blue-700 text-white">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* DATA */}
      <div className="bg-white rounded-2xl border-2 mt-5">
        <Link href="" className="border-b flex items-center justify-between p-4 rounded-t-xl hover:bg-switch-background">
          <div className="flex items-center gap-x-3">
            <LuDatabase className="text-2xl text-muted-foreground" />
            <div>
              <label className="text-sm text-gray-500">
                Data Backup
              </label>
              <p>Secure cloud backup</p>
            </div>
          </div>
          <IoIosArrowForward className="text-xl text-muted-foreground" />
        </Link>

        <Link href="" className="flex items-center justify-between p-4 rounded-b-xl hover:bg-switch-background">
          <div className="flex items-center gap-x-3">
            <LuDatabase className="text-2xl text-muted-foreground" />
            <div>
              <label className="text-sm text-gray-500">
                Export Data
              </label>
              <p>Download transactions</p>
            </div>
          </div>
          <IoIosArrowForward className="text-xl text-muted-foreground" />
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-white border-2 rounded-xl py-6 text-center">
          <h2 className="text-2xl font-bold">
            {stats?.totalTransactions ?? 0}
          </h2>
          <p className="text-sm text-muted-foreground">
            Transactions
          </p>
        </div>

        <div className="bg-white border-2 rounded-xl py-6 text-center">
          <h2 className="text-2xl font-bold">
            {stats?.totalCategories ?? 0}
          </h2>
          <p className="text-sm text-muted-foreground">
            Categories
          </p>
        </div>

        <div className="bg-white border-2 rounded-xl py-6 text-center">
          <h2 className="text-2xl font-bold">
            {stats?.totalMonths ?? 0}
          </h2>
          <p className="text-sm text-muted-foreground">
            Months
          </p>
        </div>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-100 text-red-500 flex items-center justify-center gap-x-3 rounded-xl mt-8 py-3 font-semibold"
      >
        <LuLogOut className="text-xl" />
        Logout
      </button>

      <Navbar />
    </div>
  );
}

export default Page;