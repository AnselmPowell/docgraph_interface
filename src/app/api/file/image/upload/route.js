import { pinata } from "@/app/api/file/pinata";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // Generate a unique key for this upload
    const uuid = crypto.randomUUID();
    
    // Create a temporary API key
    const keyData = await pinata.keys.create({
      keyName: uuid.toString(),
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
          },
        },
      },
      maxUses: 1,
    });

    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Upload the file using the temporary key
    const uploadData = await pinata.upload.file(file, {
      jwt: keyData.JWT,
    });

    // Create a signed URL for the uploaded file
    const signedUrl = await pinata.gateways.createSignedURL({
      cid: uploadData.cid,
      expires: 3600, // URL expires in 1 hour
    });

    // Return the upload data and signed URL
    return NextResponse.json({
      fileId: uploadData.id,
      cid: uploadData.cid,
      url: signedUrl,
      name: file.name,
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}