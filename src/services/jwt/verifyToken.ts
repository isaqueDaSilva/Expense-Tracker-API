import { verifyJWT } from "../jwt/jwtService.js";
import {
  deleteSession,
  isValidationCodeExist,
} from "../sessions/sessionCRUD.js";

export async function verifyAccessToken(
  token: string,
  secret: string | undefined
): Promise<string> {
  try {
    const { userID, verificationCode, error } = verifyJWT(token, secret, false);

    if (typeof verificationCode === "string") {
      if (await isValidationCodeExist(userID, verificationCode)) {
        return userID;
      } else {
        throw error;
      }
    } else {
      throw new Error(
        "The fields user id and verification code seams that is not contained at the token payload."
      );
    }
  } catch (error) {
    throw error;
  }
}

export async function isRefreshTokenValid(
  refreshTokenID: string,
  token: string,
  secret: string | undefined
) {
  try {
    const { userID, error } = verifyJWT(token, secret, true);

    if (error) {
      console.log("Refresh token is invalid to be used. Error:", error);
      await deleteSession(refreshTokenID);
    }
    return;
  } catch (error) {
    console.log("Refresh token is invalid to be used. Error:", error);
    await deleteSession(refreshTokenID);
    return;
  }
}
