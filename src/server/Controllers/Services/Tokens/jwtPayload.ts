export interface JWTPayload {
    id: string;
    issuer: string;
    subject: string;
    issuedAt: string;
    expiration: string
}