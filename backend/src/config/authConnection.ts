import mongoose, { Connection } from "mongoose";

import { MONGO_URI } from "./env";

let authConnection: Connection | null = null;

export async function getAuthConnection(): Promise<Connection> {
  if (authConnection) {
    return authConnection;
  }

  const connection = await mongoose
    .createConnection(MONGO_URI, {
      dbName: "ledgerguard_auth",
    })
    .asPromise();

  authConnection = connection;

  return connection;
}

export async function closeAuthConnection(): Promise<void> {
  if (!authConnection) {
    return;
  }

  await authConnection.close();
  authConnection = null;
}