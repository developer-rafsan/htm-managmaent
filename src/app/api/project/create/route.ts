import { NextResponse, NextRequest } from "next/server";
import { DBconnect } from "@/dbConfig/dbConfig";
import Project from "@/models/Project";

export async function POST(request: NextRequest) {
  try {
    await DBconnect();

    const projectData = await request.json();

    console.log(projectData);

    return NextResponse.json(
      { success: true, message: "create successful" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
