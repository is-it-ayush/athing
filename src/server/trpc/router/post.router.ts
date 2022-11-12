import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Post } from "@prisma/client";


export const postRouter = router({
    create: protectedProcedure.input(z.object({
        text: z.string().trim().min(20, 'The Note should at least contain 20 characters.').max(3001, 'The Note can only contain 3000 characters.'),
    })).mutation(async ({ input, ctx }) => {
        const { text } = input;

        // [DEBUG]
        console.log(`Length: ${text.length}`);

        try {

            const post = await ctx.prisma.post.create({
                data: {
                    text,
                    userId: ctx.session,
                }
            });

            if (!post) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to create post.', });
            }

            return {
                id: post.id,
                result: true,
            };
        }
        catch (err: TRPCError | any) {

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }),
    get: protectedProcedure.input(z.object({
        id: z.string().trim(),
    })).query(async ({ input, ctx }) => {
        const { id } = input;

        try {

            const post = await ctx.prisma.post.findUnique({
                where: {
                    id,
                },
            }) as Post;

            if (!post) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Post not found.', });
            }

            return post;
        }
        catch (err: TRPCError | any) {

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }),
    delete: protectedProcedure.input(z.object({
        id: z.string().trim(),
    })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        try {

            const post = await ctx.prisma.post.delete({
                where: {
                    id,
                },
            }) as Post;

            if (!post) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Post not found.', });
            }

            return {
                result: true,
            };
        }
        catch (err: TRPCError | any) {

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }),
    edit: protectedProcedure.input(z.object({
        id: z.string().trim(),
        text: z.string().trim().min(20, 'The Note should at least contain 20 characters.').max(3001, 'The Note can only contain 3000 characters.'),
    })).mutation(async ({ input, ctx }) => {
        const { id, text } = input;

        try {

            const post = await ctx.prisma.post.update({
                where: {
                    id,
                },
                data: {
                    text,
                },
            }) as Post;

            if (!post) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Post not found.', });
            }

            return {
                result: true,
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