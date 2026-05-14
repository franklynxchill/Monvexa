import Link from "next/link"
import { CgFileDocument } from "react-icons/cg"
import { FaRegUser } from "react-icons/fa"
import { GoHome } from "react-icons/go"
import { IoSettingsOutline } from "react-icons/io5"
import { LuChartPie } from "react-icons/lu"


function Navbar() {
  return (
    <div>
      <nav className=" fixed bottom-0 z-40 w-full py-3 border-t-2 border-t-gray-300 bg-white">
        <div className=" flex items-center gap-x-5">
          <Link href="/dashboard" className=" flex flex-col gap-y-1 items-center justify-center text-[.9rem] md:text-base">
            <GoHome className=" text-xl" />
            Home
          </Link>
          <Link href="/transactions" className=" flex flex-col gap-y-1 items-center justify-center text-[.9rem] md:text-base">
            <CgFileDocument className="text-xl" />
            History
          </Link>
          <Link href="/insights" className=" flex flex-col gap-y-1 items-center justify-center text-[.9rem] md:text-base">
            <LuChartPie className="text-xl" />
            Analytics
          </Link>
          <Link href="/settings" className=" flex flex-col gap-y-1 items-center justify-center text-[.9rem] md:text-base">
            <IoSettingsOutline className="text-xl" />
            Settings
          </Link>
          <Link href="/profile" className=" flex flex-col gap-y-1 items-center justify-center text-[.9rem] md:text-base">
            <FaRegUser className="text-xl" />
            Profile
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar