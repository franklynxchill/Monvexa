import express, { Request, Response} from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoute from "./routes/auth.routes";
import transactionRoute from "./routes/transaction.routes";
import categoryRoute from "./routes/category.routes";
import dashboardRoute from "./routes/dashboard.routes"
import insightsRoutes from "./routes/insights.routes"
import { seedCategories } from "./seeds/category.seed";

dotenv.config();
connectDB();
// seedCategories();
const app = express();


// middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoute)
app.use("/api/transactions", transactionRoute)
app.use("/api/categories", categoryRoute)
app.use("/api/dashboard", dashboardRoute)
app.use("/api/insights", insightsRoutes)


const PORT = process.env.PORT || 5100

app.listen(PORT, () =>  {
  console.log(`Server running on port ${PORT}...`);
})
