import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { NextApiRequest } from "next/types";
import superjson from "superjson";
import * as jwt from "jsonwebtoken";
import { parseCookies } from "nookies";

import { type AppRouter } from "../server/trpc/router/_app";
import { PrismaClient } from "@prisma/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;


/**
 * Helper for getting the user's session. Only used internally.
 * @example const session = await getSession(opts.req)
 */

export const getSession = async (opts: { req: NextApiRequest }, prisma: PrismaClient) => {

  console.log(`getSession called!`);
  const cookies = JSON.parse(JSON.stringify(opts.req.cookies));
  const session = cookies.token ?? null;
  const secret = await process.env.JWT_SECRET as string

  if (!session) {
    return null;
  }

  // Verify JWT (Typescript)
  try {
    const decoded = jwt.verify(session, secret) as {
      id: string;
    };

    // Fetch the user from the database using the id in the JWT
    const userData = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    })

    // If the user is blacklisted, return null
    if (userData?.isBlacklisted) {
      return null;
    }

    // Return the user
    return decoded.id
  }
  catch (err) {
    return null;
  }
}



