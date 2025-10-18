export interface JWTPayload {
    id: string;
    issuer?: string;
    subject: string;
    validationCode?: string;
    issuedAt: string;
    expiration: string
};