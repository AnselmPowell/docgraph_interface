// src/app/api/file/pinata.js
"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});



export const deletePinataFile = async (cid) => {
  console.log("[PinataService] Starting unpin process for CID:", cid);

  try {
    const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error(
        "[PinataService] Failed to unpin file. Status:",
        response.status,
        response.statusText,
        "Response:",
        responseBody
      );
      throw new Error(
        `Failed to unpin file: ${response.status} ${response.statusText}`
      );
    }

    console.log("[PinataService] Successfully unpinned file");
    return true;
  } catch (error) {
    console.error("[PinataService] Error unpinning file:", error.message);
    return false;
  }
};


