import { Request, Response } from "express";
import Category from "../models/category.model";
import Transaction from "../models/transaction.model";


export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type, icon, color } = req.body;
    
    const userId = req.user?.userId;

    if (!name || !type || !icon || !color) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid category type" });
    }

    const normalizedName =
      name.trim().charAt(0).toUpperCase() +
      name.trim().slice(1).toLowerCase();

    const existingCategory = await Category.findOne({
      name: normalizedName,
      userId,
    })

    if (existingCategory) {
      return res.status(409).json({ message: "Category already exist" })
    }


    const newCategory = await Category.create({
      name: normalizedName,
      type, 
      icon, 
      color, 
      userId,
      isDefault: false,
    });
    res.status(201).json({ 
      message: "category created",
      data: {
      id: newCategory._id,
      name: newCategory.name, 
      type: newCategory.type,
      icon: newCategory.icon,
      color: newCategory.color,
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({message : "Server error"})
  }
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;

    const userId = req.user?.userId;

    // 🔍 Build filter
    const filter: any = {
      $or: [
        { isDefault: true },
        { userId: userId }
      ]
    };

    // Optional filter by type
    if (type) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error"});
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;
    const userId = req.user?.userId;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.isDefault) {
      return res.status(403).json({
        message: "Default categories cannot be modified",
      });
    }

    if (category.userId?.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (name) category.name = name.trim().toLowerCase();
    if (icon) category.icon = icon;
    if (color) category.color = color;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.isDefault) {
      return res.status(403).json({
        message: "Default categories cannot be deleted",
      });
    }

    if (category.userId?.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const used = await Transaction.findOne({ category: id });

    if (used) {
      return res.status(400).json({
        message: "Category is in use"
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message : "Server error"});
  }
}

