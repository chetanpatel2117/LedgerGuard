import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    summary: {
      totalUsage: "1,240h",
      monthlySpend: "$18.4K",
      activeResources: 18,
      utilization: "82%",
    },
    usageOverTime: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [180, 220, 260, 240, 310, 290],
    },
    resourceConsumption: {
      labels: ["Compute", "Storage", "Network", "AI", "Security"],
      values: [68, 54, 42, 81, 63],
    },
    costDistribution: {
      labels: ["Infrastructure", "Support", "Licensing", "Storage"],
      values: [42, 19, 24, 15],
    },
  });
});

export default router;
