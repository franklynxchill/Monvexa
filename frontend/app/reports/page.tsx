import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";


export default function page() {
  return (
    <div>
      <Siderbar/>
      <Header/>
      <main className=" fixed top-20 right-0 w-screen py-4 px-6 md:w-[78.7%] overflow-hidden">
        <div className=" flex items-center justify-between">
          <div className="">
            <h1 className=" text-2xl font-bold">Reports</h1>
            <p>Analyze your financial performance</p>
          </div>
          <div className="">
            <button className=" bg-blue-500 text-white text-sm py-2 px-4 rounded-lg flex items-center gap-x-2"> 
              <MdOutlineFileDownload className=" text-2xl" />
              Export PDF
            </button>
          </div>
        </div>

        <div className=" bg-white shadow-2xs rounded-xl border-2 border-gray-300 mt-12 px-8 py-6">
          <div className=" flex items-center gap-x-3">
            <FiCalendar className=" text-2xl" />
            <span>Period:</span>
          </div>
        </div>
      </main>
    </div>
  )
}
