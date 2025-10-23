import jwt from "jsonwebtoken";
import type { IncomingMessage } from "http";
import { JWTPayload } from "./jwtPayload.js";
import { randomUUID } from "crypto";

export type AccessToken = { token: string; verificationCode: string };
export type RefreshToken = { id: string; token: string; expiresOn: string };

function createAccessToken(userID: string, issuedAt: Date): AccessToken {
  const randomNumber = Math.floor(Math.random() * 1000000).toString();
  const issuer = process.env.JWT_ISSUER || "Expense Tracker API";
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const verificationCode = randomUUID();
  let accessToken: string;

  const accessTokenPayload: JWTPayload = {
    id: userID + randomNumber + issuedAt.getTime().toString(),
    issuer: issuer,
    subject: userID,
    validationCode: verificationCode,
    issuedAt: issuedAt.toString(),
    expiration: new Date(issuedAt.getTime() + 60 * 60 * 250).toString(), // 15 minutes
  };

  if (typeof accessTokenSecret === "string") {
    accessToken = jwt.sign(accessTokenPayload, accessTokenSecret);
  } else {
    throw new Error("Failed to create access token.");
  }

  return { token: accessToken, verificationCode: verificationCode };
}

function createRefreshToken(userID: string, issuedAt: Date): RefreshToken {
  const refreshTokenExpirationDate = new Date(
    issuedAt.getTime() + 60 * 60 * 1_000 * 24
  ); // 1 Day
  const randomNumber = Math.floor(Math.random() * 1000000).toString();
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  const id = userID + randomNumber + issuedAt.getTime().toString();
  let refreshToken: string;

  const refreshTokenPayload: JWTPayload = {
    id: id,
    issuedAt: issuedAt.toString(),
    subject: userID,
    expiration: refreshTokenExpirationDate.toString(),
  };

  if (typeof refreshTokenSecret === "string") {
    refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret);
  } else {
    throw new Error("Failed to create refresh token.");
  }

  return {
    id: id,
    token: refreshToken,
    expiresOn: refreshTokenExpirationDate.toISOString(),
  };
}

export function createJWT(userID: string): {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
} {
  const issuedAt: Date = new Date();

  const accessToken = createAccessToken(userID, issuedAt);
  const refreshToken = createRefreshToken(userID, issuedAt);

  return { accessToken: accessToken, refreshToken: refreshToken };
}

export function verifyJWT(
  token: string,
  secret: string | undefined,
  isRefreshToken: boolean
): { userID: string; verificationCode?: string; error?: Error } {
  const issuer = process.env.JWT_ISSUER;

  if (!(typeof secret === "string")) {
    console.log("No secret is available to verify a JWT token");
    throw new Error("JWT Secret is not available.");
  }

  if (!(typeof issuer === "string")) {
    console.log("No issuer is available to verify a JWT token");
    throw new Error("JWT issuer is not available.");
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    }) as JWTPayload;
    const currentDate = new Date();
    const expirationDate = new Date(decoded.expiration);
    const issuedAt = new Date(decoded.issuedAt);

    if (!isRefreshToken) {
      if (!(decoded.issuer == issuer)) {
        return {
          userID: decoded.subject,
          error: new Error(
            "Issuer not matches as the issuer value of this API."
          ),
        };
      }
    }

    if (issuedAt == expirationDate || expirationDate <= currentDate) {
      return {
        userID: decoded.subject,
        error: new Error("Invalid token with time outside of the range."),
      };
    }

    return {
      userID: decoded.subject,
      verificationCode: decoded.validationCode,
    };
  } catch (error) {
    throw error;
  }
}

export function getJWTValue(request: IncomingMessage): string {
  const authHeader = request.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Invalid Authorization header format");
  }

  return token;
}
