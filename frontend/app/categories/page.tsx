"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiEdit, FiPlus } from "react-icons/fi";
import { FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { GoHome, GoTag } from "react-icons/go";
import { PiCarProfile, PiSuitcase } from "react-icons/pi";
import { IoMdTrendingUp } from "react-icons/io";
import Navbar from "@/component/Navbar";
import { RiDeleteBinLine } from "react-icons/ri";

// const colorOptions = [
//   "#ef4444", // Red
//   "#f97316", // Orange
//   "#eab308", // Yellow
//   "#22c55e", // Green
//   "#3b82f6", // Blue
//   "#8b5cf6", // Purple
//   "#ec4899", // Pink
//   "#6b7280", // Gray
// ];

const iconOptions = [
  {
    name: "shopping",
    icon: FiShoppingBag,
  },
  {
    name: "transport",
    icon: PiCarProfile,
  },
  {
    name: "rent",
    icon: GoHome,
  },
  {
    name: "salary",
    icon: FiDollarSign,
  },
  {
    name: "freelance",
    icon: PiSuitcase,
  },
  {
    name: "investment",
    icon: IoMdTrendingUp,
  },
  {
    name: "other",
    icon: GoTag,
  },
];

export default function page() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createCategory, setCreateCategory] = useState(false)

  const [categoryData, setCategoryData] = useState({
    name: "",
    type: "expense",
    icon: "",
    // color: "", // First chosen color
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleColorSelect = (color: string, colorField: 'color') => {
  //   setCategoryData({
  //     ...categoryData,
  //     [colorField]: color,
  //   });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // refresh categories
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            credentials: "include",
          }
        );

        const categoryDataRes = await categoryRes.json();

        setCategories(categoryDataRes.data);

        // reset form
        setCategoryData({
          name: "",
          type: "expense",
          icon: "",
          // color: "",
        });

        setCreateCategory(false);
        setEditingId(null);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include", // If you have cookies for auth
      });
      const data = await res.json();

      if (res.ok) {
        // remove deleted category instantly from UI
        setCategories((prev) =>
          prev.filter((item) => item._id !== id)
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } 
  };

  // 🔹 Fetch categories from backend
  useEffect(()=> {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`,{
          credentials: "include",
        })

        const data = await res.json()
        setCategories(data.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
  }, []);


  return (
    <div className=" px-4 mt-6 mb-36">
      <main>
        <div className=" py-5 px-5 rounded-lg bg-primary/15 border-2 border-primary flex items-start gap-x-4">
          <div className="">
            <FiAlertCircle className=" text-2xl text-primary" />
          </div>
          <div className="">
            <h3 className=" mb-2 font-medium">Categories help you organize your money</h3>
            <p>
              You can't delete categories that are already used in transactions
            </p>
          </div>
        </div>


        <div className=" mt-8 space-y-7">
          <div className="">
            <h2 className=" text-green-600 font-bold">Income Categories</h2>
            <div className=" mt-4">
              {categories
                .filter(
                  (cat) => cat.type === "income"
                )
                .map((item, index) => (
                  <div key={item._id || index} className=" flex items-center justify-between border-2 p-5 rounded-lg bg-white mb-4">
                    <div>
                      <h3 className=" font-medium">{item.name}</h3>
                    </div>
                    <div className=" flex items-center gap-x-6">
                      <FiEdit className=" text-xl cursor-pointer"
                        onClick={() => {
                          setCreateCategory(true);

                          setEditingId(item._id)

                          setCategoryData({
                            name: item.name,
                            type: item.type,
                            icon: item.icon,
                            // color: item.color, 
                          });
                        }}
                      />
                      <RiDeleteBinLine 
                        className=" text-red-500 text-xl cursor-pointer"
                        onClick={()=> handleDelete(item._id)} 
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="">
            <h2 className=" text-red-600 font-medium">Expense Categories</h2>
            <div className=" mt-4">
              {categories
                .filter(
                  (cat) => cat.type === "expense"
                )
                .map((item, index) => (
                  <div key={item._id || index} className=" flex items-center justify-between border-2 p-5 rounded-lg bg-white mb-4">
                    <div>
                      <h3 className=" font-medium">{item.name}</h3>
                    </div>
                    <div className=" flex items-center gap-x-6">
                      <FiEdit className=" text-xl cursor-pointer"
                        onClick={() => {
                          setCreateCategory(true);

                          setEditingId(item._id);

                          setCategoryData({
                            name: item.name,
                            type: item.type,
                            icon: item.icon,
                            // color: item.color, 
                          })
                        }}
                      />
                      <RiDeleteBinLine 
                        className=" text-red-500 text-xl cursor-pointer" 
                        onClick={() => handleDelete(item._id)}
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <button 
          type="button"
          className=" bg-primary text-white font-bold py-3 mt-6 w-full rounded-lg flex items-center justify-center gap-x-3"
          onClick={(e) => setCreateCategory(true)}
        >
          <FiPlus className=" text-2xl" />
          Add Category 
        </button>
      </main>

      {createCategory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>

            <form onSubmit={handleSubmit}>
              <div className="my-4">
                <label className="font-medium">Category Name</label>

                <input
                  type="text"
                  name="name"
                  value={categoryData.name}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border-2 mt-2"
                  placeholder="e.g Shopping"
                />
              </div>

              <div>
                <label className="font-medium">Type</label>

                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCategoryData({
                        ...categoryData,
                        type: "expense",
                      })
                    }
                    className={`flex-1 border-2 rounded-xl py-3 ${
                      categoryData.type === "expense"
                        ? "bg-red-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryData({
                        ...categoryData,
                        type: "income",
                      })
                    }
                    className={`flex-1 border-2 rounded-xl py-3 ${
                      categoryData.type === "income"
                        ? "bg-green-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <label className="font-medium">Choose Icon</label>

                <div className="grid grid-cols-4 gap-3 mt-3">
                  {iconOptions.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setCategoryData({
                            ...categoryData,
                            icon: item.name,
                          })
                        }
                        className={`border-2 rounded-xl p-4 flex items-center justify-center text-xl ${
                          categoryData.icon === item.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <Icon />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* <div className="mt-5">
                <label className="font-medium">Choose Color</label>

                <div className="flex flex-wrap gap-3 mt-3">
                  {colorOptions.map((color, index) => (
                    <button
                      key={color || index}
                      type="button"
                      onClick={() =>
                        setCategoryData({
                          ...categoryData,
                          color,
                        })
                      }
                      className={`w-10 h-10 rounded-full ${
                        categoryData.color === color
                          ? "border-4 border-black"
                          : "border-2 border-transparent"
                      }`}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </div> */}

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setCreateCategory(false)}
                  className="flex-1 border-2 rounded-lg py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white rounded-lg py-3"
                >
                  {isLoading ? editingId ? "Updating..."  : "Adding..." : editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  )
}
