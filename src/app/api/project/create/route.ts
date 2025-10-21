import { NextRequest, NextResponse } from "next/server";
import { DBconnect } from "@/dbConfig/dbConfig";
import Project from "@/models/Project";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

type DomainDetails = {
  url: string;
  userId: string;
  password: string;
};

type FileObject = {
  asset_id: string;
  url: string;
};

type ProjectPayload = {
  clientName: string;
  orderId: string;
  projectType: string;
  projectBudget: number;
  withoutFiverrBudget: number;
  projectDescription: string;
  deliveryDate: string;
  projectReferences: string[];
  projectFigmas: string[];
  ourDomainDetails: DomainDetails;
  clientExistingSite: DomainDetails;
  projectConversationFiles: FileObject[];
  projectResourceFiles: FileObject[];
};

export async function POST(request: NextRequest) {
  try {
    await DBconnect();
    const formData = await request.formData();

    /******************************************
     *********Extract Simple Fields*************
     *******************************************/
    const get = (key: string) => (formData.get(key) as string) || "";

    // Simple fields
    const clientName = get("clientName");
    const orderId = get("orderId");
    const projectType = get("projectType");
    const projectDescription = get("projectDescription");
    const deliveryDate = get("deliveryDate");

    // Budget: parse number and calculate withoutFiverrBudget if empty
    const projectBudget = Number(get("projectBudget"));
    const withoutFiverrBudgetTemp = get("withoutFiverrBudget");
    const withoutFiverrBudget =
      withoutFiverrBudgetTemp && withoutFiverrBudgetTemp.trim() !== ""
        ? Number(withoutFiverrBudgetTemp)
        : Math.round(projectBudget * 0.8);

    /**********************************************************************
     *********Extract Arrays (projectReferences, projectFigmas)*************
     ***********************************************************************/
    const extractArray = (prefix: string) =>
      Array.from(formData.entries())
        .filter(([key]) => key.startsWith(`${prefix}[`))
        .map(([_, value]) => value as string)
        .filter(Boolean);

    const projectReferences = extractArray("projectReferences");
    const projectFigmas = extractArray("projectFigmas");

    /******************************************
     *********Extract Nested Objects************
     *******************************************/
    const extractNested = (prefix: string): DomainDetails => ({
      url: get(`${prefix}[url]`),
      userId: get(`${prefix}[userId]`),
      password: get(`${prefix}[password]`),
    });

    const ourDomainDetails = extractNested("ourDomainDetails");
    const clientExistingSite = extractNested("clientExistingSite");

    /******************************************
     ****Extract & Upload Files to Cloudinary****
     *******************************************/
    const projectConversationFilesRaw = formData.getAll(
      "projectConversationfiles"
    ) as File[];
    const projectResourceFilesRaw = formData.getAll(
      "projectResourceFiles"
    ) as File[];

    // Upload files concurrently
    const [conversationUploads, resourceUploads] = await Promise.all([
      uploadToCloudinary(projectConversationFilesRaw, "conversation_files"),
      uploadToCloudinary(projectResourceFilesRaw, "resource_files"),
    ]);

    // Validate required fields
    const requiredFields: Record<string, any> = {
      clientName,
      orderId,
      projectType,
      projectBudget,
      conversationUploads,
      resourceUploads,
      projectDescription,
      deliveryDate,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return NextResponse.json(
          { success: false, message: `The field "${key}" is required.` },
          { status: 400 }
        );
      }
    }

    // Map uploaded files to schema format
    const projectConversationFiles = conversationUploads.map((f: any) => ({
      asset_id: f.asset_id,
      url: f.secure_url,
    }));

    const projectResourceFiles = resourceUploads.map((f: any) => ({
      asset_id: f.asset_id,
      url: f.secure_url,
    }));

    // Create project payload
    const projectData: ProjectPayload = {
      clientName,
      orderId,
      projectType,
      projectBudget,
      withoutFiverrBudget,
      projectDescription,
      deliveryDate,
      projectReferences,
      projectFigmas,
      ourDomainDetails,
      clientExistingSite,
      projectConversationFiles,
      projectResourceFiles,
    };

    // Save to MongoDB
    const newProject = await Project.create(projectData);

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
