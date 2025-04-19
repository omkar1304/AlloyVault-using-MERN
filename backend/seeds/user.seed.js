import { getHashedPassword } from "../lib/bcryptPassowrd.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import mongoose from "mongoose";

const seedUserDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://Omkar1304:Omkar1304@cluster0.mrq1llb.mongodb.net/Alloy?retryWrites=true&w=majority&appName=Cluster0");
    const hashedPassword = await getHashedPassword("Omkar@1304");
    const role = await Role.findOne({name: "Super Admin"})
    if(!role){
        throw new Error("Super Admin role not found");
    }
    await User.create({
      firstName: "Omkar",
      lastName: "Pedamkar",
      displayName: "Omkar Pedamkar",
      email: "omkarpedamkar2@gmail.com",
      password: hashedPassword,
      isAdminApproved: true,
      role: role?._id,
    });
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedUserDatabase();
