import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { response } from "express";
import { generateToken } from "../../utils/generateToken.js";

export const signupUser = async (req, res) => {
   const { username, fullname, email, password } = req.body;
   try {
      if (!username || !fullname || !email || !password) {
         return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false,
         });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({
            message: "User already exists",
            error: true,
            success: false,
         });
      }
      if (password.length < 6) {
         return res.status(400).json({
            message: "Password must be at least 6 characters",
            error: true,
            success: false,
         });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
         username,
         fullname,
         email,
         password: hashPassword,
      });
      const savedUser = await newUser.save();

      //generate token with userID
      const token = generateToken(savedUser._id);
      //send token back to user
      res.cookie("token", token, {
         path: "/",
         httpOnly: true,
         secure: true,
         sameSite: "strict",
         maxAge: 24 * 60 * 60 * 1000, //30days
      });

      return res.status(200).json({
         message: "User created successfully",
         error: false,
         success: true,
         data: {
            username: savedUser.username,
            fullname: savedUser.fullname,
            email: savedUser.email,
            token,
         },
      });
   } catch (error) {
      return res.status(400).json({
         message: "Invalid User Data",
         error: true,
         success: false,
      });
   }
};

export const loginUser = async (req, res) => {
   const { username, password } = req.body;
   try {
      if (!username || !password) {
         return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false,
         });
      }
      const userExits = await User.findOne({ username });
      if (!userExits) {
         return res.status(400).json({
            message: "User not found",
            error: true,
            success: false,
         });
      }
      const isPasswordValid = await bcrypt.compare(
         password,
         userExits.password
      );
      if (!isPasswordValid) {
         return res.status(400).json({
            message: "Invalid password",
            error: true,
            success: false,
         });
      }
      const token = generateToken(userExits._id);

      if (userExits && isPasswordValid) {
         const { _id, username, fullname, email } = userExits;
         //set token in cookie
         res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, //30days
         });
         return res.status(200).json({
            message: "User logged in successfully",
            error: false,
            success: true,
            data: {
               _id,
               username,
               fullname,
               email,
               token,
            },
         });
      }
   } catch (error) {
      return res.status(400).json({
         message: "Invalid User Data",
         error: true,
         success: false,
      });
   }
};
