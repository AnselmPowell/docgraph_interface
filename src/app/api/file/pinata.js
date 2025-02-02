// src/app/api/file/pinata.js
"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export const deletePinataFile = async (file_id) => {
  console.log("[PinataService] Starting delete process for file ID:", file_id);

  try {
    const deleteResult = await pinata.files.delete([file_id]);
    console.log("[PinataService] Delete result:", deleteResult);

    if (deleteResult && deleteResult[0]) {
      if (deleteResult[0].status.includes('HTTP error: {"error":{"code":404')) {
        console.log("[PinataService] File not found, considering it as already deleted");
        return true; // Consider it a success if the file is not found
      } else if (deleteResult[0].status === 'success') {
        console.log("[PinataService] Successfully deleted file");
        return true;
      } else {
        console.error("[PinataService] Failed to delete file:", deleteResult[0].status);
        return false;
      }
    } else {
      console.error("[PinataService] Unexpected delete result format");
      return false;
    }
  } catch (error) {
    console.error("[PinataService] Error during file deletion:", error);
    return false;
  }
};



