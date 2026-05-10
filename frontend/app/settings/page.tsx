"use client"

import Navbar from "@/component/Navbar"
import Link from "next/link"
import { BsQuestionCircle, BsTag } from "react-icons/bs"
import { FiBell, FiDollarSign } from "react-icons/fi"
import { IoIosArrowForward } from "react-icons/io"
import { LuDatabase, LuMoon, LuShield } from "react-icons/lu"
import { TbWorld } from "react-icons/tb"

export default function page() {
  return (
    <div className="px-4">
      <main className=" mt-6  mb-36 space-y-3">
        <div className="">
          <h2>Preferences</h2>
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300 p-3 ">
            <Link href="" className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-x-3">
                <FiDollarSign className=" text-2xl" />

                <p className=" font-bold">Currency</p>
              </div>
              <div className=" flex items-center gap-x-2">
                <p>Nigerian Naira (₦)</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <TbWorld className=" text-2xl" />

                <p className=" font-bold">Language</p>
              </div>
              <div className=" flex items-center gap-x-2">
                <p>English</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <LuMoon className=" text-2xl" />

                <p className=" font-bold">Dark Mode</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h2>Notifications</h2>
   
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300 p-3">
            <Link href="" className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-x-3">
                <FiBell className=" text-2xl" />

                <p className=" font-bold">Push Notifications</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <FiBell className=" text-2xl" />

                <p className=" font-bold">Daily Reminders</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <FiBell className=" text-2xl" />

                <p className=" font-bold">Budget Alerts</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h2>Customization</h2>   
     
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300 p-3">
            <Link href="/categories" className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-x-3">
                <BsTag className=" text-2xl" />

                <p className=" font-bold">Categories</p>
              </div>
              <div className=" flex items-center gap-x-2">
                <p>Manage</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <FiDollarSign className=" text-2xl" />

                <p className=" font-bold">Budget Settings</p>
              </div>
              <div className=" flex items-center gap-x-2">
                <p>Configure </p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h2>Security & Privacy</h2>          
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300 p-3">
            <Link href="" className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-x-3">
                <LuShield  className=" text-2xl" />

                <p className=" font-bold">Security</p>
              </div>
              <div className=" flex items-center gap-x-2">
                <p>PIN & Biometrics</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <LuShield className=" text-2xl" />

                <p className=" font-bold">Privacy Policy</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>
        
        <div className="">
          <h2>Support</h2>
          
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300 p-3">
            <Link href="" className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-x-3">
                <BsQuestionCircle className=" text-2xl" />

                <p className=" font-bold">Help Center</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-3.5 border-t-2">
              <div className="flex items-center gap-x-3">
                <BsQuestionCircle className=" text-2xl" />

                <p className=" font-bold">Contact Support</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Navbar />
    </div>
  )
}
