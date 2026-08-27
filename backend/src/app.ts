import express from "express";
import tenantTestRouter from "./routes/tenantTest";
import authTestRouter from "./routes/authTest";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "LedgerGuard API Gateway is running",
  });
});

app.use("/test-tenant", tenantTestRouter);
app.use("/auth-test", authTestRouter);

export default app;
