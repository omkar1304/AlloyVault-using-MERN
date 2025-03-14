import User from "../../models/user.model.js";
import Role from "../../models/role.model.js";
import generateToken from "../../lib/generateToken.js";
import decryptData from "../../lib/decryptData.js";
import {
  compareHashedPassword,
  getHashedPassword,
} from "../../lib/bcryptPassowrd.js";
import createActivityLog from "../../helpers/createActivityLog.js";
import generateOTP from "../../helpers/generateOTP.js";
import sendEmail from "../../lib/sendEmail.js";
import sendOTPTemplate from "../../emailTemplates/sendOTPTemplate.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = decryptData(
      req.body.payload
    );

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await getHashedPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      const token = generateToken(
        {
          userId: newUser?._id,
          email: newUser.email,
        },
        res
      );
      await createActivityLog(newUser?._id, "User registered successfully");
      return res
        .status(201)
        .json({ message: "User registered successfully!", token });
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
    await createActivityLog(user?._id, "User logged in successfully");
    res.status(201).json({ message: "User Logged in successfully", token });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { userId } = req.user;
    res.cookie("jwt", "", { maxAge: 0 });
    await createActivityLog(userId, "User logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email = undefined } = decryptData(req.body.payload);

    if (!email) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const { subject, intro } = sendOTPTemplate(otp);
    await sendEmail({ to: user.email, subject, intro: intro });

    res.status(200).json({ message: "OTP sent to your email"});
  } catch (error) {
    console.log("Error in send otp controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = decryptData(req.body.payload);

    if (!email) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpires) {
      return res.status(401).json({ message: "OTP expired" });
    }

    return res.json({ message: "OTP verified. You can reset your password." });
  } catch (error) {
    console.log("Error in verify otp controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = decryptData(req.body.payload);

    if (!email) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await getHashedPassword(password);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    await createActivityLog(user?._id, "User updated password successfully");
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error in verify reset password controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
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
      isAdminApproved: user?.isAdminApproved,
      perms: role?.perms,
    });
  } catch (error) {
    console.log("Error in getAuthenticatedUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
