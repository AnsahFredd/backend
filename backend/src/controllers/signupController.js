import exprees from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    // Checking if user already exists
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user in the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },

      //  Selecting the field we want to return
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const token = jsonwebtoken.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ newUser, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export default signup;
