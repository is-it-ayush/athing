
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Entry } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


export const entryRouter = router({
    create: protectedProcedure.input(z.object({
        title: z.string().trim().min(1).max(100),
        journalId: z.string(),
        content: z.string().trim().min(20, 'The Conent should at least contain 20 characters.').max(3001, 'The Content can only contain 3000 characters.'),
    })).mutation(async ({ input, ctx }) => {
        const { journalId, content, title } = input;

        console.log(`Creating a new entry with jorunalId: ${journalId} and content: ${content.length}`);

        try {

            const entry = await ctx.prisma.entry.create({
                data: {
                    journalId,
                    text: content,
                    title,
                }
            }) as Entry;


            if (!entry) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to create entry.', });
            }

            return {
                id: entry.id,
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
    getOne: protectedProcedure.input(z.object(
        {
            entryId: z.string(),
        }
    )).query(async ({ input, ctx }) => {

        const { entryId } = input;

        try {

            const entry = await ctx.prisma.entry.findUnique({
                where: {
                    id: entryId,
                },
            }) as Entry;

            return entry;
        }
        catch (err: TRPCError | any) {

            throw new TRPCError({
                code: err.code || 'INTERNAL_SERVER_ERROR',
            });

            // --todo-- add error logging to sentry
        }

    }),
    update: protectedProcedure.input(z.object({
        entryId: z.string(),
        content: z.string().trim().min(20, 'The Conent should at least contain 20 characters.').max(3001, 'The Content can only contain 3000 characters.'),
    })).mutation(async ({ input, ctx }) => {
        const { entryId, content } = input;

        console.log(`Updating entry with id: ${entryId} and content: ${content.length}`);

        try {

            const entry = await ctx.prisma.entry.update({
                where: {
                    id: entryId,
                },
                data: {
                    text: content,
                }
            });

            if (!entry) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to update entry.', });
            }

            return {
                id: entry.id,
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
    delete: protectedProcedure.input(z.object({
        id: z.string(),
    })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        console.log(`Deleting entry with id: ${id}`);

        try {

            const entry = await ctx.prisma.entry.delete({
                where: {
                    id,
                }
            }) as Entry;

            if (!entry) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to delete entry.', });
            }

            return {
                id: entry.id,
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
    getAll: protectedProcedure.input(z.object({
        journalId: z.string(),
    })).query(async ({ input, ctx }) => {
        const { journalId } = input;

        if (journalId.length < 1) {
            return [];
        }

        try {
            const journal = await ctx.prisma.journal.findUnique({
                where: {
                    id: journalId,
                },
                include: {
                    entries: {
                        select: {
                            id: true,
                            title: true,
                            createdAt: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        }
                    }
                }
            });

            return journal?.entries ? journal.entries : [];
        }
        catch (err: PrismaClientKnownRequestError | any) {
            if (err.code === 'P2025' || err.code === 'P2018') {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'The requested journal was not found!', });
            }
            throw new TRPCError({ code: 'BAD_REQUEST', message: err.message, });
        }
    })
})

// --todo-- This needs a middleware to ensure the user is the owner of the journal