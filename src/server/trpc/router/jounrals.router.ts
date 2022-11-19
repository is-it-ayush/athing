import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type Journal } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const journalRouter = router({
    // This will create a new journal.
    create: protectedProcedure.input(z.object({
        title: z.string().trim().min(20, 'The Title should at least contain 20 characters.').max(50, 'The Title can only contain 50 characters.'),
        isPrivate: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
        const { title, isPrivate } = input;

        try {
            await ctx.prisma.journal.create({
                data: {
                    title,
                    userId: ctx.session as string,
                    isPublic: !isPrivate,
                }
            });

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
    // Update a single journal
    update: protectedProcedure.input(z.object({
        id: z.string(),
        title: z.string().trim().min(20, 'The Title should at least contain 20 characters.').max(50, 'The Title can only contain 50 characters.'),
        isPrivate: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
        const { id, title, isPrivate } = input;

        try {

            const j = await ctx.prisma.journal.findUnique({
                where: {
                    id,
                },
            })

            if (j?.userId !== ctx.user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized.', });
            }

            await ctx.prisma.journal.update({
                where: {
                    id,
                },
                data: {
                    title,
                    isPublic: !isPrivate,
                }
            }) as Journal;

            return {
                result: true,
            };
        }
        catch (err: PrismaClientKnownRequestError | any) {

            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2025' || err.code === 'P2018') {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'The requested journal was not found!', });
                }
            }
            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });
        }

    }),
    // Delete a single journal
    delete: protectedProcedure.input(z.object({
        id: z.string(),
    })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        try {

            const j = await ctx.prisma.journal.findUnique({
                where: {
                    id,
                },
            })

            if (j?.userId !== ctx.user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized.', });
            }

            await ctx.prisma.journal.delete({
                where: {
                    id,
                }
            });

            return {
                result: true,
            };
        }
        catch (err: PrismaClientKnownRequestError | any) {

            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2025' || err.code === 'P2018') {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'The requested journal was not found!', });
                }
            }

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }
    ),
    // This will get you 3 random journals.
    getRandom: protectedProcedure.input(z.object(
        {
            cursor: z.string().optional(),
        }
    )).query(async ({ input, ctx }) => {

        const { cursor } = input;

        try {

            const journals = await ctx.prisma.journal.findMany({
                where: {
                    isPublic: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                take: 3,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
            }) as Journal[];

            return journals;
        }
        catch (err: TRPCError | any) {

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }),
    getJournalsByUserId: protectedProcedure.input(z.object({
        id: z.string(),
    })).query(async ({ input, ctx }) => {
        const { id } = input;

        try {
            
            if (ctx.user !== id) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: "You're not authorized.", });
            }

            const user = await ctx.prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    journals: {
                        orderBy: {
                            createdAt: "desc",
                        }
                    },
                }
            });


            return user?.journals ? user.journals : [];
        }
        catch (err: PrismaClientKnownRequestError | any) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2021' || err.code === 'P2022') {
                    return [];
                }
            }
            throw new TRPCError({ code: 'BAD_REQUEST', message: err.message, });
        }
    }),
});