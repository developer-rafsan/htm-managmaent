import { NextResponse, NextRequest } from "next/server";
import { DBconnect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await DBconnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Verify if email is confirmed
    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email first" },
        { status: 403 }
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // Set token in secure cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
    });

    return response;
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
