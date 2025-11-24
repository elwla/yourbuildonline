import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateEncryptedUrl, decryptUrl} from '@/libs/encryption'
import crypto from 'crypto';

vi.stubGlobal('process', {
  env: {
    ENCRYPTION_SECRET: 'test-secret-key-12345'
  }
});

describe('Encription Library', () => { 
    const originalRandomBytes = crypto.randomBytes;
    const originalCreateCipheriv = crypto.createCipheriv;
    const originalCreateDecipheriv = crypto.createDecipheriv;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        crypto.randomBytes = originalRandomBytes;
        crypto.createCipheriv = originalCreateCipheriv;
        crypto.createDecipheriv = originalCreateDecipheriv;
    });

    describe('Encription', () => { 
        it('Debe encriptar correctamente la url del proyecto', async () => {
            const projectId = 1234;

            const result = generateEncryptedUrl(projectId);

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(129); 
        })

        it('debe funcionar con diferentes projectIds', () => {
            const projectIds = [1, 100, 9999, 123456];
            
            projectIds.forEach(projectId => {
                const result = generateEncryptedUrl(projectId);
                
                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
                
                const decrypted = decryptUrl(result);
                expect(decrypted).toBe(projectId.toString());
            });
        });
    })

    describe('decryptUrl', () => { 
        it('debe desencriptar correctamente una URL encriptada válida', () => {
            const projectId = 123;
            
            const encryptedUrl = generateEncryptedUrl(projectId);
            const decrypted = decryptUrl(encryptedUrl);

            expect(decrypted).toBe(projectId.toString());
        });

        it('debe retornar null para URL encriptada inválida', () => {
            const invalidUrl = 'invalid-encrypted-url';
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const result = decryptUrl(invalidUrl);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                '❌ Invalid encrypted URL format. Expected IV:encrypted'
            );

            consoleSpy.mockRestore();
        });

        it('debe retornar null para formato incorrecto (sin :)', () => {
            const malformedUrl = 'invalidformatwithoutcolon';
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const result = decryptUrl(malformedUrl);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                '❌ Invalid encrypted URL format. Expected IV:encrypted'
            );

            consoleSpy.mockRestore();
        });

        it('debe retornar null para URL con formato corrupto', () => {
            const corruptUrl = 'invalid:encrypted:data'; // Múltiples :
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const result = decryptUrl(corruptUrl);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                '❌ Invalid encrypted URL format. Expected IV:encrypted'
            );

            consoleSpy.mockRestore();
        });

        it('debe retornar null cuando el IV es inválido', () => {
            const invalidIvUrl = 'invalidiv:encrypteddata';
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const result = decryptUrl(invalidIvUrl);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                '❌ Invalid encrypted URL format. Expected IV:encrypted'
            );

            consoleSpy.mockRestore();
        });

        it('debe retornar null cuando el texto encriptado es inválido', () => {
            const validIv = crypto.randomBytes(16).toString('hex');
            const invalidEncryptedUrl = `${validIv}:invalidencryptedtext`;
            const base64Url = Buffer.from(invalidEncryptedUrl).toString('base64url');
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const result = decryptUrl(base64Url);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                '❌ Error decrypting URL:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
     })

    describe('Integration - Encrypt and Decrypt', () => { 
        it('debe encriptar y desencriptar correctamente manteniendo el projectId', () => {
            const projectIds = [1, 42, 100, 999, 12345];
      
            projectIds.forEach(projectId => {
                const encrypted = generateEncryptedUrl(projectId);
                const decrypted = decryptUrl(encrypted);
                
                expect(decrypted).toBe(projectId.toString());
            });
        });

        it('debe generar URLs que sean URL-safe', () => {
            const projectId = 123;
            
            const encryptedUrl = generateEncryptedUrl(projectId);
            
            expect(encryptedUrl).toMatch(/^[A-Za-z0-9_-]+$/);
            expect(encryptedUrl).not.toContain('+');
            expect(encryptedUrl).not.toContain('/');
            expect(encryptedUrl).not.toContain('=');
        });
    })        
 })