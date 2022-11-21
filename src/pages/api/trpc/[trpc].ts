import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
import { createContext } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ error, type, path, input }) => {
        console.log("Error in", type, "at", path, "with input", input);
        console.log(error);
      }
      : ({ error }) => {
        console.error('Error:', error);
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          // --todo-- add error logging to sentry/axiom :)
        }
      }
});
