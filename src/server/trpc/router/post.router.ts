import { z } from 'zod';

import { router, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { type Post } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { POSTS_PER_PAGE } from '@components/pages/Notes';

export const postRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z
          .string()
          .trim()
          .min(20, 'The note should at least contain 20 characters.')
          .max(3001, 'The note can only contain 3000 characters.'),
        isPrivate: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { text, isPrivate } = input;

      try {
        const post = await ctx.prisma.post.create({
          data: {
            text,
            userId: ctx.session,
            isPublished: !isPrivate,
          },
        });

        if (!post) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Unable to create post.',
          });
        }

        return {
          id: post.id,
          result: true,
        };
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.message });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while creating post.',
          });
        }
        // --todo-- add error logging.
      }
    }),
  get: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { cursor } = input;

      try {
        const posts = await ctx.prisma.post.findMany({
          where: {
            isPublished: true,
          },
          include: {
            User: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            at: 'desc',
          },
          take: POSTS_PER_PAGE,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
        });

        if (!posts) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'There was a error fetching Notes.',
          });
        }

        return posts;
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.message });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while fetching Notes.',
          });
        }
        // --todo-- add error logging.
      }
    }),
  getPostsByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string().trim(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      if (ctx.session !== id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "You're not authorized.",
        });
      }

      try {
        const userPosts = await ctx.prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            posts: {
              orderBy: {
                at: 'desc',
              },
            },
          },
        });

        if (!userPosts) return { id: ctx.session, posts: [] };

        return {
          id: userPosts.id,
          posts: userPosts.posts,
        };
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2021' || err.code === 'P2022') {
            return {
              id: ctx.session,
              posts: [],
            };
          }
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while fetching Notes.',
          });
        }
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().trim(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      try {
        const post = (await ctx.prisma.post.delete({
          where: {
            id,
          },
        })) as Post;

        if (!post || post.userId !== ctx.session) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Post not found.',
          });
        }

        return {
          result: true,
        };
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025' || err.code === 'P2018') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'The requested notes were not found!',
            });
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the post.',
        });

        // --todo-- add error logging.
      }
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().trim(),
        text: z
          .string()
          .trim()
          .min(20, 'The mote should at least contain 20 characters.')
          .max(3001, 'The mote can only contain 3000 characters.'),
        isPrivate: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, text, isPrivate } = input;

      try {
        const post = (await ctx.prisma.post.findUnique({
          where: {
            id,
          },
        })) as Post;

        if (!post || post.userId !== ctx.session) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Post.',
          });
        }

        await ctx.prisma.post.update({
          where: {
            id,
          },
          data: {
            text,
            isPublished: !isPrivate,
          },
        });

        return {
          result: true,
        };
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025' || err.code === 'P2018') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'The requested notes were not found!',
            });
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the post.',
        });
      }
    }),
  share: protectedProcedure
    .input(
      z.object({
        id: z.string().trim(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      try {
        const post = (await ctx.prisma.post.findUnique({
          where: {
            id,
          },
        })) as Post;

        if (!post || post.userId !== ctx.session) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Post.',
          });
        }

        await ctx.prisma.post.update({
          where: {
            id,
          },
          data: {
            shared: !post.shared,
          },
        });

        return {
          result: true,
          shared: post.shared,
        };
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025' || err.code === 'P2018') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'The requested notes were not found!',
            });
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while sharing the post.',
        });
      }
    }),
  getSharedPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      try {
        const sharedPost = await ctx.prisma.post.findUnique({
          where: {
            id: id,
          },
          select: {
            text: true,
            User: {
              select: {
                username: true,
              },
            },
            id: true,
            shared: true,
            at: true,
          },
        });

        if (!sharedPost || !sharedPost.shared) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Post.',
          });
        }
        return sharedPost;
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.message });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while fetching note.',
          });
        }
        // --todo-- add error logging.
      }
    }),
});
