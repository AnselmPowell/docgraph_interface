"server only";

import { pinata } from "@/app/api/file/pinata";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {

  const { fileId } = await request.json();
    try {
      const response = await pinata.files.delete([fileId]);

      return NextResponse.json( response , { status: 200 });
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete file",
      };
    }
}