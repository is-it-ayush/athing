import { initTRPC, TRPCError } from "@trpc/server";
import { getClientInfo, rateLimiter } from "@utils/server.util";
import superjson from "superjson";
import { type Context } from "./context";

const VERCEL_URL = process.env.VERCEL_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;

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

  console.log(`isAuthenticated middleware called!`);


  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      user: ctx.session,
    }
  });
});

const rateLimit = t.middleware(async ({ ctx, next }) => {

  // Getting the Client IP.
  if (NODE_ENV === "production") {
    const ci = getClientInfo(ctx.req);

    if (!ci.ip || !ci.host || ci.host !== VERCEL_URL) {
      throw new TRPCError({ code: 'FORBIDDEN', message: "The request is denied." });
    }

    try {
      const res = await rateLimiter.consume(ci.ip, 2);
      console.log(`Rate limit remaining: ${res.remainingPoints}`);
      console.log(res.toJSON(), null, 2);
    }
    catch (err) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: "Too many requests." });
    }
  }
  return next();
});


export const router = t.router;

// This is thr procedure for public routes
export const publicProcedure = t.procedure.use(rateLimit);

// This is the procedure for authenticated routes
export const protectedProcedure = t.procedure.use(isAuthenticated);


