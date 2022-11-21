import bcrypt from 'bcrypt';
import { type PrismaClient } from '@prisma/client';
import * as jwt from "jsonwebtoken";
import { type NextApiRequest } from 'next/types';
import { nanoid } from 'nanoid';
import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * Hashes a string using bcrypt
 * @param {string} str - The string to hash
 * @returns {string} - The hashed string
 */

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Compares a string to a hashed string using bcrypt
 * @param password  - The string to compare
 * @param hash - The hashed string
 * @returns 
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

/**
 * Format Response
 * @param {string} message - The message to send
 * @param {number} status - The status code to send
 * @param {object} data - The data to send (optional)
 * @returns {object} - The formatted response
 */

export const formatResponse = (message: string, status: number, data?: object): object => {
    return {
        statusCode: status,
        message: message,
        data
    }
}

/**
 * Generate a username staring with anonymous
 * @returns {string} - The generated username
 */

export const generateUsername = async (): Promise<string> => {
    const randomId = await nanoid(13);
    return `u_${randomId}`;
}

/**
 * This will act as a middleware and fetch the user from the cookie and store it in the request context.
 * @param opts : The req (NextApiRequest).
 * @param prisma : The prisma (PrismaClient) objects
 * @returns null | string - The user id string or null
 */
export const getSession = async (opts: { req: NextApiRequest }, prisma: PrismaClient) => {

    console.log(`getSession called!`);
    const cookies = JSON.parse(JSON.stringify(opts.req.cookies));
    const session = cookies.token ?? null;
    const secret = await process.env.JWT_SECRET as string

    if (!session) {
        return null;
    }

    // Verify JWT (Typescript)
    try {
        const decoded = jwt.verify(session, secret) as {
            id: string;
        };

        // Fetch the user from the database using the id in the JWT
        const userData = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })

        // If the user is blacklisted, return null
        if (userData?.isBlacklisted) {
            return null;
        }

        // Return the user
        return decoded.id
    }
    catch (err) {
        return null;
    }
}

/**
 * Convert the string to Pascal Case.
 * @param {string} str - The string to convert
 * @returns {string} - The converted string
 */

export const formatString = (str: string): string => {
    let newStr = str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
    newStr = newStr.replace(/\s{2,}/g, " ");
    return newStr;
}

export const rateLimiter = new RateLimiterMemory({
    points: 10, // 8 requests
    duration: 60, // per 1 minute by IP 
});

/**
 * Extract Client IP from Forwarded Headers.
 * Since we are using a CDN (Vercel), we need to extract the client IP from the forwarded headers.
 * @param {NextApiRequest} req - The request object
 */
export const getClientInfo = (req: NextApiRequest) => {

    const header = req.headers.forwarded as string;
    const userInfo = {
        ip: header.split(';')[0]?.split('=')[1] || null,
        host: header.split(';')[1]?.split('=')[1] || null,
    }
    return userInfo;
}