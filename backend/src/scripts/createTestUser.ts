import "dotenv/config";
import bcrypt from "bcryptjs";

import { getUserModel } from "../models/User";
import { closeAuthConnection } from "../config/authConnection";

async function createTestUser() {
  try {
    const User = await getUserModel();

    const email = "admin@companyA.com";
    const password = "password123";
    const tenantId = "companyA";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Test user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      tenantId,
    });

    console.log("Test user created successfully.");
    console.log(`Email: ${email}`);
    console.log(`Tenant: ${tenantId}`);
  } catch (error) {
    console.error("Failed to create test user:", error);
  } finally {
    await closeAuthConnection();
  }
}

void createTestUser();