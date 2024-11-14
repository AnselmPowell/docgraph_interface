"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});


export const deletePinataFile = async (fileId) => {
  try {
    const response = await pinata.files.delete([fileId]);
    return response[0].status === "OK";
  } catch (error) {
    console.error('Error deleting file from Pinata:', error);
    return false;
  }
};
