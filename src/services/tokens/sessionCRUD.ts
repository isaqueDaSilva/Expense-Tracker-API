import { NeonQueryPromise } from "@neondatabase/serverless";
import { database } from "../../app.js";

export function createSession(
  userID: string,
  accessTokenVerificationCode: string,
  refreshToken: string,
  refreshTokenID: string
): NeonQueryPromise<false, false, Record<string, any>[]> {
  const newSession = `
        INSERT INTO sessions(user_id, at_verification_code, refresh_token_id, refresh_token)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;

  const values = [
    userID,
    accessTokenVerificationCode,
    refreshTokenID,
    refreshToken,
  ];
  return database.query(newSession, values);
}

export async function isValidationCodeExist(
  userID: string,
  verificationCode: string
): Promise<boolean> {
  const session = `
        SELECT (user_id, at_verification_code) 
        COUNT (at_verification_code) 
        FROM sessions
        WHERE user_id = $1 AND at_verification_code = $2;
    `;

  const values = [userID, verificationCode];
  const result = await database.query(session, values);

  if (result.length == 1) {
    const sessionCount = (result[0] as { count: string }).count;

    if (sessionCount == "1") {
      return true;
    } else if (sessionCount == "0") {
      return false;
    } else {
      console.log(
        `Exist more than 1 session with the same verification code. Look at the database soon as possible. Count ${sessionCount}`
      );
      throw new Error(`Internal server error occur.`);
    }
  } else {
    throw new Error("Cannot possible to check if the session is valid.");
  }
}

export async function getRefreshToken(refreshTokenID: string): Promise<string> {
  const session = `
        SELECT (refresh_token) FROM sessions
        WHERE refresh_token_id = $1;
    `;

  const values = [refreshTokenID];
  const result = await database.query(session, values);

  if (result.length == 1) {
    const refreshToken = result[0];

    if (typeof refreshToken === "string") {
      return refreshToken as string;
    } else {
      console.log(
        `Seams that the refresh token with id ${refreshTokenID}, not exists at the database or the type is not a string.`
      );
      throw new Error("Internal server error.");
    }
  } else {
    throw new Error("No task was created.");
  }
}

export async function updateSession(
  currentRefreshTokenID: string,
  newRefreshTokenID: string,
  newRefreshToken: string,
  newVerificationCode: string
) {
  const updateSession = `
        UPDATE sessions
        SET at_verification_code = $1, refresh_token_id = $2, refresh_token = $3, updated_at = CURRENT_TIMESTAMP
        WHERE refresh_token_id = $4;
    `;

  const values = [
    newVerificationCode,
    newRefreshTokenID,
    newRefreshToken,
    currentRefreshTokenID,
  ];
  await database.query(updateSession, values);
}

export function deleteSession(
  refreshTokenID: string
): NeonQueryPromise<false, false, Record<string, any>[]> {
  const deleteSession = `
        DELETE FROM sessions
        WHERE refresh_token_id = $1;
    `;

  const values = [refreshTokenID];
  return database.query(deleteSession, values);
}
