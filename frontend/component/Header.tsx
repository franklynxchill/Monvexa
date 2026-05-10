import { GoBell } from "react-icons/go"
import { IoSettingsOutline } from "react-icons/io5"
import { LuLogOut, LuSearch } from "react-icons/lu"

function Header() {
  return (
    <div className=" fixed top-0 right-0 bg-white shadow-2xs w-screen py-4 px-8 md:w-[78.7%] overflow-hidden">
      <div className=" flex items-center">
        <div className=" flex items-center gap-x-12 pr-6">
          <div className=" bg-gray-300/20 py-2 px-4 w-lg rounded-lg flex items-center gap-x-2">
            <LuSearch />
            <input type="search" name="" id="" className=" w-full" placeholder="Search transaction..."/>
          </div>
          
          <div className=" flex items-center gap-x-5">
            <div className=" p-2 hover:bg-gray-300/10">
              <GoBell  className=" text-xl"/>
            </div>
            <div className=" p-2 hover:bg-gray-300/10">
              <IoSettingsOutline className=" text-xl" />
            </div>
          </div>
        </div>

        <div className=" border-l-2 border-l-gray-300 pl-6">
          <LuLogOut className=" text-xl" />
        </div>
      </div>
    </div>
  )
}

export default Header