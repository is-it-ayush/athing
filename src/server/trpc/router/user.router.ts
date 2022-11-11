import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { comparePassword, generateUsername, hashPassword } from "../../../utils/server.util";
import { User } from "@prisma/client";

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
                throw new TRPCError({ code: 'BAD_REQUEST' });
            }


            // Exists; compare password
            const valid: Boolean = await comparePassword(password, user.password);

            if (!valid) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }

            // TODO: Create JWT


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
    signup: publicProcedure.input(z.object(
        {
            password: z.string().min(8, 'Password must be at least 8 characters long.'),
        }
    )).mutation(async ({ input, ctx }) => {

        const { password } = input;

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
                },
            }) as User;

            if (!createUser) {
                throw new TRPCError({ code: 'BAD_REQUEST' });
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
});