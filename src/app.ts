import express, { Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is up and running");
});

app.get("/test", (_req: Request, res: Response) => {
  res.status(200).send("Hello this works now");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;

