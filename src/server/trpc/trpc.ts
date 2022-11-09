import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context"; 

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});


/**
 * This middleware is used to check if the user is logged in by checking the session cookie.
 * A session cookie is set when the user logs in. It is an JWT token that contains the user's id.
 * @param ctx, the context of the request
 * @param next, the next middleware
 */
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      user: ctx.session,
    }
  });
});

export const router = t.router;

// This is thr procedure for public routes
export const publicProcedure = t.procedure;

// This is the procedure for authenticated routes
export const protectedProcedure = t.procedure.use(isAuthenticated);


