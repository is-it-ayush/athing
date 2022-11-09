import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { NextApiRequest } from "next/types";
import superjson from "superjson";
import * as jwt from "jsonwebtoken";

import { type AppRouter } from "../server/trpc/router/_app";

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

export const getSession = async (opts: { req: NextApiRequest }) => {
  
  const session = opts.req.cookies.session as string | undefined;

  if (!session) {
    return null;
  }

  // Verify JWT (Typescript)
  try {
    const decoded = jwt.verify(session, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    return decoded.userId
  }
  catch (err) {
    return null;
  }
}



