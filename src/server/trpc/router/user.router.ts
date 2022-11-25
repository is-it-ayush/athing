import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { comparePassword, generateUsername, hashPassword } from "../../../utils/server.util";
import { type User } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { CaptchaResponse } from "@utils/server.typing";
import { THEME_CONFIG } from "@utils/PatternController";

// Variables
const secretVar = process.env.CAPTCHA_SECRET as string;
const spc_pwd = process.env.SPECIAL_ACCESS_PWD as string;
const isUnderMaintenance = process.env.MAINTENANCE_MODE as string;

const len = Object.keys(THEME_CONFIG).length;

export const userRouter = router({
    login: publicProcedure.input(z.object(
        {
            username: z.string().regex(/^[a-zA-Z0-9_-]+$/, "Username must be between 3 and 20 characters long and can only contain letters, numbers and underscores."),
            password: z.string().min(8, 'Password must be at least 8 characters long.').max(30, 'Password must be at most 30 characters long.'),
            rememberMe: z.boolean()
        }
    )).mutation(async ({ input, ctx }) => {

        const { username, password, rememberMe } = input;

        if (isUnderMaintenance === 'true') {
            if (password !== spc_pwd) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'The server is under maintenance.' });
            }
        }

        let user: User;

        try {

            // Find user
            user = await ctx.prisma.user.findUnique({
                where: {
                    username,
                },
            }) as User;

        }
        catch (err) {

            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while logging in.' });
            // --todo-- add error logging.
        }

        // Doesn't exist; Return.
        if (!user) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid username or password.' });
        }

        // Exists; compare password
        const valid: boolean = await comparePassword(password, user.password);

        if (!valid) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid username or password.' });
        }

        // TODO: Create JWT Cookie
        const secret = await process.env.JWT_SECRET as string;
        const token = jwt.sign({
            id: user.id,
        }, secret, { expiresIn: rememberMe ? '7d' : '1d' }) as string;



        return {
            result: true,
            token: token
        };


    }
    ),
    signup: publicProcedure.input(z.object({
        password: z.string().min(8, 'Password must be at least 8 characters long.').max(30, 'Password must be at most 30 characters long.'),
        acceptTerms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms and conditions.' }),
        token: z.string()
    }
    )).mutation(async ({ input, ctx }) => {

        const { password, acceptTerms, token } = input;

        if (isUnderMaintenance === 'true') {
            if (password !== spc_pwd) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'The server is under maintenance.' });
            }
        }


        try {

            const captchRes = await fetch(`https://hcaptcha.com/siteverify`, {
                method: 'POST',
                body: new URLSearchParams({
                    secret: secretVar,
                    response: token,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(res => res.json()) as CaptchaResponse;

            if (!captchRes.success) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'The request was denied.' });
            }

            // Generate a username
            let username: string;

            /**
             * Generate a username
             * It'll loop very-very rarely, but it'll never error out.
             * So, it's fine. Since, I'm using nanoid, it's very unlikely to have a collision.
             */
            while (true) {
                username = await generateUsername();
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        username,
                    },
                }) as User;

                if (!user) {
                    break;
                }
            }

            // Hash Password
            const hashedPassword: string = await hashPassword(password);

            // Create User
            const createUser = await ctx.prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    acceptedTerms: acceptTerms,
                },
            }) as User;

            return {
                username: createUser.username
            };
        }
        catch (err) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while signing up.' });
            // --todo-- add error logging to sentry
        }
    }),
    update: protectedProcedure.input(z.object(
        {
            styling: z.number().min(0, 'Invalid styling option.').max(len, 'Invalid styling option.'),
        }
    )).mutation(async ({ input, ctx }) => {

        const { styling } = input;

        try {

            await ctx.prisma.user.update({
                where: {
                    id: ctx.user,
                },
                data: {
                    styling: styling
                }
            });

            return {
                result: true
            };
        }
        catch (err) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while updating your account.' });
            // --todo-- add error logging to sentry
        }
    }),
    delete: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {
        try {
            console.log(`Deleting User: ${ctx.user}`);
            await ctx.prisma.user.delete({
                where: {
                    id: ctx.user,
                },
            });
            return {
                result: true
            };
        }
        catch (err) {
            console.log(err)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while deleting your account.' });
            // --todo-- add error logging to sentry
        }
    }),
    me: protectedProcedure.query(async ({ ctx }) => {

        try {

            if (ctx.session === null) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid username or password.', }); // Bogus error message
            }

            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session,
                },
            }) as User;

            return {
                username: user.username,
                id: user.id,
                styling: user.styling
            };
        }
        catch (err) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred.' });
            // --todo-- add error logging.
        }
    }),
    feedback: protectedProcedure.input(z.object(
        {
            text: z.string().min(20, 'Feedback must be at least 20 character long.').max(1000, 'Feedback must be at most 1000 characters long.'),
        }
    )).mutation(async ({ input, ctx }) => {

        const { text } = input;

        try {


            await ctx.prisma.feedback.create({
                data: {
                    text,
                    authorId: ctx.user,
                },
            });

            return {
                result: true
            };
        }
        catch (err) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while sending feedback.' });
            // --todo-- add error logging.
        }
    }),
});