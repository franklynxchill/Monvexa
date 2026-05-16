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
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300">
            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background rounded-t-xl ">
              <div className="flex items-center gap-x-3">
                <FiDollarSign className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Currency</p>
              </div>
              <div className=" flex items-center gap-x-2 text-muted-foreground">
                <p>Nigerian Naira (₦)</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2">
              <div className="flex items-center gap-x-3">
                <TbWorld className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Language</p>
              </div>
              <div className=" flex items-center gap-x-2 text-muted-foreground">
                <p>English</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2 rounded-b-xl ">
              <div className="flex items-center gap-x-3">
                <LuMoon className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Dark Mode</p>
              </div>
              <div className="text-muted-foreground">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h2>Notifications</h2>
   
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300">
            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background rounded-t-xl ">
              <div className="flex items-center gap-x-3">
                <FiBell className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Push Notifications</p>
              </div>
              <div className="text-muted-foreground">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2">
              <div className="flex items-center gap-x-3">
                <FiBell className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Daily Reminders</p>
              </div>
              <div className="text-muted-foreground">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2 rounded-b-xl ">
              <div className="flex items-center gap-x-3">
                <FiBell className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Budget Alerts</p>
              </div>
              <div className="text-muted-foreground">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h2>Customization</h2>   
     
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300">
            <Link href="/categories" className="flex items-center justify-between p-4 hover:bg-switch-background rounded-t-xl ">
              <div className="flex items-center gap-x-3">
                <BsTag className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Categories</p>
              </div>
              <div className=" flex items-center gap-x-2 text-muted-foreground">
                <p>Manage</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2 rounded-b-xl ">
              <div className="flex items-center gap-x-3">
                <FiDollarSign className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Budget Settings</p>
              </div>
              <div className=" flex items-center gap-x-2 text-muted-foreground">
                <p>Configure </p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h2>Security & Privacy</h2>          
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300">
            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background rounded-t-xl ">
              <div className="flex items-center gap-x-3">
                <LuShield  className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Security</p>
              </div>
              <div className=" flex items-center gap-x-2 text-muted-foreground">
                <p>PIN & Biometrics</p>
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2 rounded-b-xl ">
              <div className="flex items-center gap-x-3">
                <LuShield className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Privacy Policy</p>
              </div>
              <div className="text-muted-foreground">
                <IoIosArrowForward className=" text-xl" />
              </div>
            </Link>
          </div>
        </div>
        
        <div className="">
          <h2>Support</h2>
          
          <div className=" bg-white rounded-xl border-2 mt-3 border-gray-300">
            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background rounded-t-xl ">
              <div className="flex items-center gap-x-3">
                <BsQuestionCircle className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Help Center</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl text-muted-foreground" />
              </div>
            </Link>

            <Link href="" className="flex items-center justify-between p-4 hover:bg-switch-background border-t-2 rounded-b-xl ">
              <div className="flex items-center gap-x-3">
                <BsQuestionCircle className=" text-2xl text-muted-foreground" />

                <p className=" font-medium">Contact Support</p>
              </div>
              <div className="">
                <IoIosArrowForward className=" text-xl text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Navbar />
    </div>
  )
}
