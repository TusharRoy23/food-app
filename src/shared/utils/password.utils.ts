import { createHash } from 'crypto';

const salt = 'random-private-key';

export async function hashPassword(password: string): Promise<string> {
    return await createHash('sha256').update(`${password}.${salt}`).digest('hex');
}

export async function isPasswordMatch(hash: string, password: string): Promise<boolean> {
    return hash === await hashPassword(password);
}