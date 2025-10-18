import { NextResponse } from "next/server";
import { DBconnect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendEmail } from "@/helper/sendEmail.js";

export async function POST(request: NextResponse) {
  try {
    await DBconnect();

    const {
      firstName,
      lastName,
      username,
      address,
      city,
      state,
      zip,
      position,
      blood,
      number,
      email,
      password,
      confirmPassword,
    } = await request.json();

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !username ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !position ||
      !blood ||
      !number ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate Bangladesh phone number
    const phoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(number)) {
      return NextResponse.json(
        { success: false, message: "Invalid Bangladeshi phone number" },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { number }],
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // Generate verification token
    const payload = { email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Create new user in DB
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      address,
      city,
      state,
      zip,
      position,
      blood,
      number,
      email,
      password,
      verificationToken: token,
    });

    const verifyUrl = `${process.env.BASE_URL}/verify?token=${token}`;

    const message = `
    <h1>Verify Your Email</h1>
    <p>Click the link below to verify your email:</p>
    <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>`;

    await sendEmail({
      email: email,
      subject: "Email Verification",
      message,
    });

    return NextResponse.json(
      { success: true, message: "Singin Suscessfull" },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
