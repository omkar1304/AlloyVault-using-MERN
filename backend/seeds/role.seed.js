import Role from "../models/role.model.js";
import mongoose from "mongoose";

const seedRoleDatabase = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/alloy");
    await Role.create({ name: "Super Admin" });
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedRoleDatabase();
