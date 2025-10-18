import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { DBconnect } from "@/dbConfig/dbConfig";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await DBconnect();

    // Extract token from URL query (?token=...)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    console.log(token);
    

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is missing" },
        { status: 400 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Find user by email from token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: true, message: "Email already verified" },
        { status: 200 }
      );
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error during verification" },
      { status: 500 }
    );
  }
}
