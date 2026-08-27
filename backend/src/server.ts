import app from "./app";
import { closeAllTenantConnections } from "./db/connectionManager";

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`LedgerGuard API Gateway running on port ${PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down LedgerGuard...`);

  server.close(async () => {
    try {
      await closeAllTenantConnections();

      console.log("All tenant MongoDB connections closed.");
      console.log("LedgerGuard API Gateway stopped.");

      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});