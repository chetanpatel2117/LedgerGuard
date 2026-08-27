import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "LedgerGuard API Gateway is running",
  });
});

app.use("/", authRoutes);

export default app;
