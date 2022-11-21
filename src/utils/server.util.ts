import bcrypt from 'bcrypt';
import { type PrismaClient } from '@prisma/client';
import * as jwt from "jsonwebtoken";
import { type NextApiRequest } from 'next/types';
import { nanoid } from 'nanoid';
import {  } from 'lru-cache';

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

/**
 * Simple LRU-Cache Rate Limiter
 * @param {string} key - The key to use for the cache
 * @param {number} limit - The limit of requests
 * @param {number} ttl - The time to live for the cache
 * @returns {boolean} - Whether the request is allowed or not
 * @example
 * const isAllowed = rateLimit("key", 5, 60);
 * if (!isAllowed) {
 *    return res.status(429).json(formatResponse("Too many requests", 429));
 * }
 * // Do something
 * return res.status(200).json(formatResponse("Success", 200));
 * 
 * // The above code will allow 5 requests per minute
 * // If the limit is reached, it will return a 429 status code
 *  
 * // If you want to use the same key for multiple routes, you can use the req.url
 * const isAllowed = rateLimit(req.url, 5, 60);
 * if (!isAllowed) {
 *   return res.status(429).json(formatResponse("Too many requests", 429));
 * }
 * // Do something
 * return res.status(200).json(formatResponse("Success", 200));
 * 
 */

// export const rateLimit = (key: string, limit: number, ttl: number): boolean => {
//     const cache = require('memory-cache');
//     const current = cache.get(key) || 0;
//     if (current >= limit) {
//         return false;
//     }
//     cache.put(key, current + 1, ttl * 1000);
//     return true;
// }