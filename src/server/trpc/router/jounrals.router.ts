import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type Journal, type Entry, User } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTime } from "framer-motion";

export const journalRouter = router({
    // This will create a new journal.
    create: protectedProcedure.input(z.object({
        title: z.string().trim().min(20, 'The Title should at least contain 20 characters.').max(50, 'The Title can only contain 50 characters.'),
        isPrivate: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
        const { title, isPrivate } = input;

        console.log(`Creating a new journal with title: ${title.length} and isPrivate: ${isPrivate}`);

        try {

            const journal = await ctx.prisma.journal.create({
                data: {
                    title,
                    userId: ctx.session as string,
                    isPublic: !isPrivate,
                }
            });

            if (!journal) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to create journal.', });
            }

            return {
                id: journal.id,
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
        title: z.string().trim().min(20, 'The Note should at least contain 20 characters.').max(3001, 'The Note can only contain 3000 characters.'),
        isPrivate: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
        const { id, title, isPrivate } = input;

        console.log(`Updating journal with id: ${id} and title: ${title.length} and isPrivate: ${isPrivate}`);

        try {

            const journal = await ctx.prisma.journal.update({
                where: {
                    id,
                },
                data: {
                    title,
                    isPublic: !isPrivate,
                }
            }) as Journal;

            if (!journal) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to update journal.', });
            }

            return {
                id: journal.id,
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
    // Delete a single journal
    delete: protectedProcedure.input(z.object({
        id: z.string(),
    })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        console.log(`Deleting journal with id: ${id}`);

        try {

            const journal = await ctx.prisma.journal.delete({
                where: {
                    id,
                }
            });

            if (!journal) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to delete journal.', });
            }

            return {
                id: journal.id,
                result: true,
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
                include: {
                    entries: true,
                },
                orderBy: {
                    createdAt: "desc",
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

            if (ctx.session !== id) {
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
        catch (err: TRPCError | any) {
            // throw new TRPCError({
            //     code: err.code || 'INTERNAL_SERVER_ERROR',
            // });
            return [];
            // --todo-- add error logging to sentry
        }
    }),
    // This will get you a single journal.
    getEntriesByJournalId: protectedProcedure.input(z.object(
        {
            id: z.string(),
        }
    )).query(async ({ input, ctx }) => {

        const { id } = input;

        try {

            const journal = await ctx.prisma.journal.findUnique({
                where: {
                    id,
                },
                include: {
                    entries: true,
                },
            }) as Journal;

            return journal;
        }
        catch (err: TRPCError | any) {

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }),
});