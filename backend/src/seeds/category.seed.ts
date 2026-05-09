import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.model";

dotenv.config();

const categories = [
  // ======================
  // EXPENSE CATEGORIES
  // ======================
  {
    name: "Food",
    type: "expense",
    icon: "shopping",
    color: "#FF6B6B",
    userId: null,
    isDefault: true,
  },
  {
    name: "Transport",
    type: "expense",
    icon: "transport",
    color: "#4D96FF",
    userId: null,
    isDefault: true,
  },
  {
    name: "Rent",
    type: "expense",
    icon: "rent",
    color: "#6BCB77",
    userId: null,
    isDefault: true,
  },
  {
    name: "Utilities",
    type: "expense",
    icon: "other",
    color: "#FFD93D",
    userId: null,
    isDefault: true,
  },

  // ======================
  // INCOME CATEGORIES
  // ======================
  {
    name: "Salary",
    type: "income",
    icon: "salary",
    color: "#4CAF50",
    userId: null,
    isDefault: true,
  },
  {
    name: "Freelance",
    type: "income",
    icon: "freelance",
    color: "#2196F3",
    userId: null,
    isDefault: true,
  },
  {
    name: "Investments",
    type: "income",
    icon: "investment",
    color: "#9C27B0",
    userId: null,
    isDefault: true,
  },
  {
    name: "Other Income",
    type: "income",
    icon: "other",
    color: "#FF9800",
    userId: null,
    isDefault: true,
  },
];

export const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);

    // 🔥 FORCE RESET DEFAULT CATEGORIES
    await Category.deleteMany({ isDefault: true });

    await Category.insertMany(categories);

    console.log("✅ Default categories (income + expense) reseeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};