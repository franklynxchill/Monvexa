import mongoose, { Document} from "mongoose";
export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  userId: mongoose.Types.ObjectId;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const  categorySchema = new mongoose.Schema<ICategory>({
  name : {
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
  color:{ 
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null, // null = system category
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);
export default Category