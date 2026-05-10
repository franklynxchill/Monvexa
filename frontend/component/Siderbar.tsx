import Link from "next/link"
import { GrTransaction } from "react-icons/gr"
import { LuChartColumn, LuDollarSign, LuFolderOpen, LuLayoutDashboard } from "react-icons/lu"


function Siderbar() {
  return (
    <div className=" bg-white shadow-xl py-12 px-5 w-72 h-screen space-y-7">
      <div className="">
        <div className=" flex items-center gap-x-3">
          <div className=" bg-blue-600 p-3 rounded-lg">
            <LuDollarSign className=" text-white text-2xl" />
          </div>
          <div className="">
            <h1 className=" font-bold text-xl">FinTracker</h1>
            <p>Business Edition</p>
          </div>
        </div>
      </div>

      <div className=" flex flex-col gap-y-5">
        <Link href="/dashboard" className=" flex items-center gap-x-3 hover:bg-gray-400/20 p-2 hover:font-bold hover:rounded-lg">
          <LuLayoutDashboard />
          Dashboard
        </Link>
        <Link href="/transactions" className=" flex items-center gap-x-3 hover:bg-gray-400/20 p-2 hover:font-bold hover:rounded-lg">
          <GrTransaction />
          Transactions
        </Link>
        <Link href="/categories" className=" flex items-center gap-x-3 hover:bg-gray-400/20 p-2 hover:font-bold hover:rounded-lg">
          <LuFolderOpen />
          Categories
        </Link>
        <Link href="/reports" className=" flex items-center gap-x-3 hover:bg-gray-400/20 p-2 hover:font-bold hover:rounded-lg">
          <LuChartColumn />
          Reports
        </Link>
      </div>
    </div>
  )
}

export default Siderbar