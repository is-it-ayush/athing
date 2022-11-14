import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { comparePassword, generateUsername, hashPassword } from "../../../utils/server.util";
import { type User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const userRouter = router({
    login: publicProcedure.input(z.object(
        {
            username: z.string().regex(/^[a-z0-9]+$/, "Username must be between 3 and 20 characters long and can only contain letters, numbers and underscores."),
            password: z.string().min(8, 'Password must be at least 8 characters long.').max(20, 'Password must be at most 20 characters long.'),
            rememberMe: z.boolean()
        }
    )).mutation(async ({ input, ctx }) => {

        const { username, password, rememberMe } = input;

        try {

            // Find user
            const user = await ctx.prisma.user.findUnique({
                where: {
                    username,
                },
            }) as User;

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
            }, secret, { expiresIn: rememberMe ? '7d' : '1d' });



            return {
                result: true,
                token: token
            };
        }
        catch (err: TRPCError | any) {
            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }
    ),
    signup: publicProcedure.input(z.object(
        {
            password: z.string().min(8, 'Password must be at least 8 characters long.'),
            acceptTerms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms and conditions.' }),
            hCaptchaResponse: z.string()
        }
    )).mutation(async ({ input, ctx }) => {

        const { password, acceptTerms, hCaptchaResponse } = input;

        if (hCaptchaResponse.length === 0) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid hCaptcha response.' });
        }

        // Verify Captcha
        const captchaResponse = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: process.env.HCAPTCHA_SECRET as string,
                response: hCaptchaResponse,
            }),
        });

        const captchaData = await captchaResponse.json();

        if (!captchaData.success) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid hCaptcha response.' });
        }

        // [DEBUG]
        // SETTING A HARD-CODED PASSWORD: REMOVE THIS IN REAL PRODUCTION. This is for test purposes only.
        if (password !== 'sheisbeautiful@1001') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'NOT_FOR_U_SORRY' });
        }

        try {

            // Generate a username
            let username: string;

            // Ensure username is unique (This is a very inefficient way of doing this).
            // --todo-- find a better way to do this
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

            if (!createUser) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to create account.', });
            }

            return {
                username: createUser.username
            };
        }
        catch (err: TRPCError | any) {
            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }
    }),
    logout: protectedProcedure.mutation(async () => {

        try {


            // --todo-- Invalidate the session.


            return {
                result: true
            };
        }
        catch (err: TRPCError | any) {
            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }
    }
    ),
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
                id: user.id
            };
        }
        catch (err: TRPCError | any) {
            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }
    })
});