import User from "../../models/user.model.js";
import Role from "../../models/role.model.js";
import generateToken from "../../lib/generateToken.js";
import decryptData from "../../lib/decryptData.js";
import {
  compareHashedPassword,
  getHashedPassword,
} from "../../lib/bcryptPassowrd.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = decryptData(req.body);

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await getHashedPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      const token = generateToken({
        userId: newUser?._id,
        email: newUser.email,
      });
      res.status(201).json({ message: "User registered successfully", token });
    }

    return res.status(400).json({ message: "Invalid user data" });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = decryptData(req.body.payload);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await compareHashedPassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(
      {
        userId: user?._id,
        email: user.email,
        roleId: user?.role,
      },
      res
    );

    res.status(201).json({ message: "User Logged in successfully", token });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAuthenticatedUser = async (req, res) => {
  try {
    const { roleId, userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(401).json({ message: "Role not found" });
    }

    return res.status(200).json({
      userId: user?._id,
      roleId: role._id,
      roleName: role?.name,
      firstName: user?.firstName,
      lastName: user?.lastName,
      displayName: user?.displayName,
      email: user?.email,
      perms: role?.perms,
    });
  } catch (error) {
    console.log("Error in getAuthenticatedUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
