import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  userId?: mongoose.Types.ObjectId | null;
  isDefault: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,   // ✅ IMPORTANT FIX
      ref: "User",
      default: null,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;