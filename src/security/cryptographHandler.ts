import { createECDH, createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'crypto';
import { SecurityKeyCache } from './SecurityKeyCache';
import type { KeyDTO } from './KeyDTO';


// MARK: KEY HHANDLER
const keyType = 'secp384r1';
const cipherAlgorithm = 'aes-256-gcm';

export function generatePublicKey(): KeyDTO {
    const p384Key = createECDH(keyType);
    p384Key.generateKeys();
    const privateKey = p521Key.getPrivateKey();
    const publicKey = p521Key.getPublicKey();
    const id = randomUUID();
    const cache = SecurityKeyCache.getInstance();
    cache.setKey(id, privateKey);
    return { id, publicKey };
};

export function generateSharedKey(id: string, clientPublicKey: Buffer): Buffer | null {
    const cache = SecurityKeyCache.getInstance();
    const privateKey = cache.getPrivateKey(id);
    if (privateKey) {
        const key = createECDH(keyType);
        key.setPrivateKey(privateKey);
        const sharedKey = key.computeSecret(clientPublicKey);
        cache.deleteKey(id);
        return sharedKey;
    } else {
        return null;
    }
}

export function encriptField(field: string, publicKey: Buffer): string {
    const key = createECDH(keyType);
    key.generateKeys();
    const iv = randomBytes(16);
    const sharedKey = key.computeSecret(publicKey);
    const cipher = createCipheriv(cipherAlgorithm, sharedKey, iv);
    let encryptedField = cipher.update(field, 'utf8', 'hex');
    encryptedField += cipher.final();
    const authTag = cipher.getAuthTag();
    encryptedField += authTag.toString('hex');

    return encryptedField
}

export function decriptField(encryptedField: string, sharedKey: Buffer): string | null {
    const iv = Buffer.from(encryptedField.slice(0, 32), 'hex');
    const authTag = Buffer.from(encryptedField.slice(-32), 'hex');
    const encryptedText = encryptedField.slice(32, -32);
    const decipher = createDecipheriv(cipherAlgorithm, sharedKey, iv);
    decipher.setAuthTag(authTag);
    let decryptedField = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedField += decipher.final('utf8');
    return decryptedField;
}

// Example usage:
// const { id, publicKey } = generatePublicKey();
// const sharedKey = generateSharedKey(id, clientPublicKey);
// const encrypted = encriptField("my secret data", publicKey);
// const decrypted = decriptField(encrypted, sharedKey);
// console.log({ encrypted, decrypted });