"use client"
import Navbar from "@/component/Navbar"
import { useRouter } from "next/navigation"
import { FiPhone } from "react-icons/fi"
import { HiOutlineMail } from "react-icons/hi"
import { IoIosArrowForward } from "react-icons/io"
import { LuCreditCard, LuDatabase, LuLogOut } from "react-icons/lu"


function page() {
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      const res = await fetch("http://localhost:5100/api/auth/logout", {
        method: "POST",
        credentials: "include" // 🔥 important for cookies
      })
      router.push("/login")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="px-4 mt-6 mb-36"> 
      <div className=" ">
        <div className=""></div>
        <div className=""></div>


        <div className=" bg-white rounded-xl border-2 border-gray-300">
          <h2 className=" font-bold p-4">Account Information</h2>
          <div className=" border-y-2 border-y-gray-300 flex items-center gap-x-3 py-3 px-4">
            <div className="">
              <HiOutlineMail className=" text-2xl" />
            </div>
            <div className="">
              <label htmlFor="">Email</label>
              <p>chinedu.okafor@email.com</p>
            </div>
          </div>

          <div className="flex items-center gap-x-3 py-3 px-4">
            <div className="">
              <FiPhone className=" text-2xl" />
            </div>
            <div className="">
              <label htmlFor="">Phone</label>
              <p>+234 803 456 7890</p>
            </div>
          </div>
        </div>

        <div className=" bg-white rounded-xl border-2 border-gray-300 mt-5">
          <h2 className=" font-bold p-4">Subscription</h2>
          <div className=" border-t-2 border-y-gray-300 flex items-center justify-between gap-x-3 py-3 px-4">
            <div className="">
              <label htmlFor="">Current Plan</label>
              <p>Pro</p>
            </div>

            <div className="">
              <LuCreditCard className=" text-2xl" />
            </div>
          </div>

          <div className="p-3 border-t-2 border-gray-300">
            <button className=" mt-3 rounded-xl bg-blue-700 text-white w-full py-3">Manage Subscription</button>
          </div>
        </div>

        <div className=" bg-white rounded-xl border-2 mt-7 border-gray-300">
          <div className=" border-y-2 border-y-gray-300 flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-x-3">
              <div className="">
                <LuDatabase className=" text-2xl" />
              </div>
              <div className="">
                <label htmlFor="">Data Backup</label>
                <p>chinedu.okafor@email.com</p>
              </div>
            </div>

            <div className="">
              <IoIosArrowForward className=" text-xl" />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-x-3">
              <div className="">
                <LuDatabase className=" text-2xl" />
              </div>
              <div className="">
                <label htmlFor="">Export Data</label>
                <p>+234 803 456 7890</p>
              </div>
            </div>

            <div className="">
              <IoIosArrowForward className=" text-xl" />
            </div>
          </div>
        </div>

        <div className="">
          <button 
            onClick={handleLogOut}
            className=" w-full bg-pink-200/50 text-red-400 flex items-center justify-center gap-x-3 rounded-xl mt-8 py-3 px-4 font-bold"
          >
            <LuLogOut className=" text-xl" />
            Logout
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  )
}

export default page