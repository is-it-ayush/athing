
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Entry, Journal } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


export const entryRouter = router({
    create: protectedProcedure.input(z.object({
        title: z.string().trim().min(10).max(40),
        journalId: z.string(),
        content: z.string().trim().min(20, 'The content should at least contain 20 characters.').max(6000, 'The content can only contain 6000 characters.'),
    })).mutation(async ({ input, ctx }) => {
        const { journalId, content, title } = input;

        console.log(`Creating a new entry with jorunalId: ${journalId} and content: ${content.length}`);

        try {

            const entry = await ctx.prisma.entry.create({
                data: {
                    journalId,
                    text: content,
                    title,
                    authorId: ctx.user
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

            // We still need to fetch the journal because we don't want unauthorized access to private journal entries.
            const journal = await ctx.prisma.journal.findUnique({
                where: {
                    id: entry.journalId,
                },
            }) as Journal;

            if (!journal.isPublic) {
                if (entry?.authorId !== ctx.user) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized.', });
                }
            }

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
        title: z.string().trim().min(10).max(40),
        entryId: z.string(),
        content: z.string().trim().min(20, 'The content should at least contain 20 characters.').max(6000, 'The content can only contain 6000 characters.'),
    })).mutation(async ({ input, ctx }) => {
        const { entryId, content, title } = input;

        try {

            const entry = await ctx.prisma.entry.findUnique({
                where: {
                    id: entryId,
                }
            })

            if (entry?.authorId !== ctx.user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized.', });
            }

            await ctx.prisma.entry.update({
                where: {
                    id: entryId,
                },
                data: {
                    text: content,
                    title: title,
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
    delete: protectedProcedure.input(z.object({
        id: z.string(),
    })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        try {

            const entry = await ctx.prisma.entry.delete({
                where: {
                    id,
                }
            })

            if (entry?.authorId !== ctx.user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized.', });
            }

            await ctx.prisma.entry.delete({
                where: {
                    id,
                }
            }) as Entry;

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

            if (!journal?.isPublic) {
                if (journal?.userId !== ctx.session) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized.', });
                }
            }

            return journal?.entries ? journal.entries : [];
        }
        catch (err: PrismaClientKnownRequestError | any) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: err.message, });
        }
    })
})

// --todo-- This needs a middleware to ensure the user is the owner of the journal