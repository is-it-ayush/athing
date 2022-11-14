import bcrypt from 'bcrypt';
import { type PrismaClient } from '@prisma/client';
import * as jwt from "jsonwebtoken";
import { type NextApiRequest } from 'next/types';
import { nanoid } from 'nanoid';

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
