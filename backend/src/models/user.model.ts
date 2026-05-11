import mongoose, {Document, Model, Schema} from "mongoose";
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  passwordResetToken?: string,
  passwordResetExpires?: Date
}

const userSchema = new mongoose.Schema<IUser> ({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    select: false,
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: { 
    type: Date 
  }
}, { timestamps: true});

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;