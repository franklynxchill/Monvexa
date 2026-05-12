"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Page() {
  const [formData, setformData ] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false)
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      alert("You must agree to terms");
      return;
    };

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
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

    alert("Signup successful");

    router.push("/dashboard")

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false); 
    }
  } 

  return (
    <div className=" bg-gray-200 px-8">
      <div className=" flex items-center justify-center h-[130vh]">
        <div className="">
           <h1 className=" text-center font-bold text-3xl">Monvexa</h1>
           <p className=" text-center mt-2">Your Money Clarity System</p>
          <div className="">
            <form
              onSubmit ={handleSubmit} 
              className=" rounded-xl bg-white mt-7 p-8 w-108 md:w-lg"
            >
              <h2 className=" font-bold text-2xl mb-6">Create an account</h2>

              {/* FULL NAME */}
              <div className="">
                <label htmlFor="">Full Name</label>
                <div className=" flex items-center gap-x-3 border-2 border-gray-400/40 p-3 rounded-2xl mt-2">
                  <FaRegUser className=" text-gray-600 text-xl" />
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className=" w-full outline-0" placeholder="Jonn Doe" 
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="mt-3">
                <label htmlFor="">Email</label>
                <div className=" flex items-center gap-x-3 border-2 border-gray-400/40 p-3 rounded-2xl mt-2">
                  <HiOutlineMail className=" text-gray-600 text-xl" />
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
              <div className=" mt-3">
                <label htmlFor="">Password</label>
                <div className=" flex items-center gap-x-3 border-2 border-gray-400/40 p-3 rounded-2xl mt-2 mb-2">
                  <FiLock className=" text-gray-600 text-xl" />
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    className=" w-full outline-0" 
                    placeholder="••••••••" 
                  />
                </div>
                <span className=" text-sm">Must be at least 8 characters</span>
              </div>

               {/* AGREEMENT */}
              <div className=" flex items-center gap-x-2 mt-5">
                <input 
                  type="checkbox" 
                  onChange={(e) => setAgreed(e.target.checked)}
                  checked = {agreed} 
                  className=" cursor-pointer"
                />
                <label htmlFor="">
                  I agree to the <span className=" text-primary text-sm">Terms of Service</span> and <span className=" text-primary text-sm">Privacy Policy</span> 
                </label>
              </div>

              {/* Submit CTA */}
              <div className=" mt-5">
                <button 
                  className=" py-3 px-4 mb-3 rounded-lg w-full text-white bg-primary"
                  type= "submit"
                  disabled= {loading}
                >
                  { loading ? "Creating..." : "Create account"}
                </button>

                <p className=" text-center">Already have an account?<Link href="/login" className=" pl-1 text-primary">Sign in </Link> </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}