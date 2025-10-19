import { NextResponse, NextRequest } from "next/server";
import { DBconnect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/helper/sendEmail";

export async function POST(request: NextRequest) {
  try {
    await DBconnect();

    const { email } = await request.json();

    if (!email) {
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

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const message = `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>`;

    await sendEmail({
      email: email,
      subject: "reset password",
      message,
    });

    return NextResponse.json(
      { success: true, message: "Send the code check your email" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
