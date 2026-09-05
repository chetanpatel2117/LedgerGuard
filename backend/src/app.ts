import express from "express";

import analyticsRouter from "./routes/analytics";
import authRouter from "./routes/auth";
import ledgerRouter from "./routes/ledger";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "LedgerGuard API Gateway is running",
  });
});

app.use("/auth", authRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ledger", ledgerRouter);

export default app;
