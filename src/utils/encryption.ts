import CryptoJS from 'crypto-js';

// Define a secret key for encryption (store it safely, e.g., in environment variables)
const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default_secret_key'; // replace with a secure key

// Function to encrypt text
export const encrypt = (text: string): string => {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  // Convert to Base64 URL-safe format
  return encrypted
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Function to decrypt data
export const decrypt = (ciphertext: string): string => {
  // Convert back from Base64 URL-safe format to standard Base64
  const base64 = ciphertext
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const bytes = CryptoJS.AES.decrypt(base64, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
