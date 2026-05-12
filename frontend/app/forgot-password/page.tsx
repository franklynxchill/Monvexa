"use client"
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";


export default function page() {
  const [email, setEmail] = useState({
    email: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading ] = useState(false);

  const handleChange = async (e:React.ChangeEvent<HTMLInputElement> ) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
        credentials: "include" // 🔥 important for cookies 
      })

      setIsSubmitted(true)

      let data;
      try {
        data = await res.json()
      } catch (error) {
        data = { Message: "Server error"}
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  
    if (isSubmitted) {
      return
      <div>
        <div>
          <h2>Check your email</h2>
          <p>
            If an account exists for starprince210@gmail.com, a password reset link has been sent.
          </p>

          <div className=" bg-white">
            <p className="text-sm text-muted-foreground">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Try again
            </button>
            <Link href="/login">Back to login</Link>
          </div>
        </div>
      </div>
    }
  return (
    <div className=" bg-gray-200 px-8">
      <div className=" flex items-center justify-center h-screen">
        <div className="">
          <h1 className=" text-center font-bold text-3xl">Monvexa</h1>
          <p className=" text-center mt-2">Your Money Clarity System</p>
          <div className="">
            <form
              onSubmit ={handleSubmit} 
              className=" rounded-xl bg-white mt-7 p-8 w-lg"
            >
              <Link href="/login" className=" flex items-center gap-x-3 mb-6 ">
                <FaArrowLeft className=" text-base text-gray-600" />
                <p className=" text-[0.8rem] text-gray-600">Back to login</p>
              </Link>
              <h2 className=" font-bold text-2xl mb-3">Forgot password?</h2>
              <p>
                Enter your email and we'll send you a reset link
              </p>

              <div className="mt-5">
                <label htmlFor="">Email</label>
                <div className=" flex items-center gap-x-3 border-2 border-border outline-ring/50 rounded-2xl mt-2 p-3">
                  <HiOutlineMail className=" text-gray-600 text-2xl" />
                  <input 
                    type="email" 
                    name="email" 
                    value={email.email}
                    onChange={handleChange}
                    className=" w-full outline-0"     
                    placeholder="name@example.com" 
                  />
                </div>
              </div>

              <div className=" mt-5">
                <button 
                  className=" py-3 px-4 mb-3 rounded-xl w-full bg-primary text-white"
                  type= "submit"
                  disabled= {loading}
                >
                  { loading ? "Sending..." : "Send reset link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
