// libs/encryption.ts
import crypto from 'crypto';

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'BEPEGRiuVZMvzu1vU4VR6N555igp23sf';

const key = crypto.createHash('sha256').update(SECRET_KEY).digest();

export function generateEncryptedUrl(projectId: number): string {
    try {
        const iv = crypto.randomBytes(16);
        const text = `${projectId}-${Date.now()}`;
        
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const combined = iv.toString('hex') + ':' + encrypted;
        const result = Buffer.from(combined).toString('base64url');
        
        return result;
    } catch (error) {
        console.error('Error generating encrypted URL:', error);
        throw error;
    }
}

export function decryptUrl(encryptedUrl: string): string | null {
    try {        
        const decoded = Buffer.from(encryptedUrl, 'base64url').toString('utf8');
        
        const parts = decoded.split(':');
        
        if (parts.length !== 2) {
            console.error('❌ Invalid encrypted URL format. Expected IV:encrypted');
            return null;
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
                
        return decrypted.split('-')[0]; // Retorna solo el projectId
    } catch (error) {
        console.error('❌ Error decrypting URL:', error);
        return null;
    }
}