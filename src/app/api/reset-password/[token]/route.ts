import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DBconnect } from "@/dbConfig/dbConfig";
import User from "@/models/User";

export async function POST(request: Request) {
  await DBconnect();

  try {
    const { token, password, confirmPassword } = await request.json();

    // Validate Inputs
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing token" },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Password fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Verify the token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY!);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Find user by decoded token data
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update password → this will trigger pre-save hook
    user.password = password;
    await user.save();

    // Return success
    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
