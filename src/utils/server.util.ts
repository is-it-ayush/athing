import bcrypt from 'bcrypt';

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
    return `anon${Math.floor(Math.random() * 1000000)}`;
}
