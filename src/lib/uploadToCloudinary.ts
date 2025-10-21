import { cloudinary } from "./configCloudinary";

export async function uploadToCloudinary(files: File[], folder = "projects") {
  const uploadedResults: any[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    uploadedResults.push(uploadResult);
  }

  return uploadedResults;
}
