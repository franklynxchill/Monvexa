"use client"
import Link from "next/link";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useRouter } from "next/navigation";


export default function page() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = ( e:React.ChangeEvent<HTMLInputElement>) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async ( e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify(formData),
       credentials: "include" // 🔥 important for cookies
      })
  
      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Server error" };
      }
      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Login successful");
      router.push("/dashboard")

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className=" bg-gray-200 ">
      <div className=" flex items-center justify-center h-screen">
        <div className="w-full max-w-lg">
          <h1 className=" text-center font-bold text-3xl">Monvexa</h1>
          <p className=" text-center mt-2">Your Money Clarity System</p>

          <form 
            onSubmit={handleSubmit}
            className=" rounded-xl bg-white mt-7 px-4 py-8 md:p-8 w-full border-2 border-border outline-ring/50 shadow-2xs"
          >
            <h2 className=" font-bold text-2xl mb-6">Welcome back</h2>

            {/*  EMAIL */}
            <div className="">
              <label htmlFor="">Email</label>
              <div className=" flex items-center gap-x-3 border-2 border-border outline-ring/50 rounded-2xl mt-2 p-3">
                <HiOutlineMail className=" text-gray-600 text-2xl" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className=" w-full outline-0"    
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className=" mt-5">
              <label htmlFor="">Password</label>
              <div className=" flex items-center gap-x-3 border-2 border-border outline-ring/50  p-3 rounded-2xl mt-2">
                <FiLock  className=" text-gray-600 text-2xl"/>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange} 
                  className=" w-full outline-0" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className=" flex items-center justify-between mt-4">
              <div className=" flex items-center gap-x-3">
                <input type="checkbox" name="" id="" className=" text-2xl cursor-pointer" />
                <label htmlFor="">Remember me</label>
              </div>

              <Link href="/forgot-password" className=" mt-2 text-primary">Forgot password?</Link>
            </div>

            <div className=" mt-4">
              <button 
                type="submit"
                disabled={loading}
                className=" py-3 px-4 mb-3 rounded-xl w-full text-white bg-primary cursor-pointer"
              > 
                {loading ? "Login..." : "Sign in"}
              </button>

              <p className=" text-center">Don't have an account? <Link href="/signup" className=" text-primary">Sign up</Link> </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
