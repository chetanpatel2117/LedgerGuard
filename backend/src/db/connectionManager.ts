import mongoose, { Connection } from "mongoose";
import { validateTenantId } from "../utils/tenantValidator";

const connectionCache = new Map<string, Promise<Connection>>();

export function getTenantConnection(tenantId: string): Promise<Connection> {

    if (!validateTenantId(tenantId)) {
        throw new Error("Invalid tenant ID");
    }

    const existingConnection = connectionCache.get(tenantId);

    if (existingConnection) {
        return existingConnection;
    }

    const dbName = `ledgerguard_${tenantId}`;

    const connectionPromise = mongoose
        .createConnection(process.env.MONGO_URI!, {
            dbName
        })
        .asPromise()
        .then((connection) => {
            console.log(`Connected to tenant database: ${dbName}`);
            return connection;
        })
        .catch((error) => {
            connectionCache.delete(tenantId);
            throw error;
        });

    connectionCache.set(tenantId, connectionPromise);

    return connectionPromise;
}