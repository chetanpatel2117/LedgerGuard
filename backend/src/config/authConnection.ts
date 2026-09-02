import mongoose, { Connection } from "mongoose";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

const MONGO_URI = getRequiredEnv("MONGO_URI");

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