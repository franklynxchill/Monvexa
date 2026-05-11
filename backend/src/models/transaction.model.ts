import mongoose, { Document, Model, Schema} from "mongoose";
export interface ITransaction extends Document {
  amount: number;
  type: "income" | "expense";
  category: mongoose.Schema.Types.ObjectId;
  date: Date;
  note: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction> ({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"], 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // 🔗 LINK
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    trim: true,
    default: "", // ✅ optional
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // ✅ performance improvement
  }
}, { timestamps: true})

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;