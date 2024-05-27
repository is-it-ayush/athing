import { createNextApiHandler } from '@trpc/server/adapters/next';

import { createContext } from '@server/trpc/context';
import { appRouter } from '@server/trpc/router/_app';
import { env } from '@env/server.mjs';

const messages = [
  'Critical Damage',
  'Fatality',
  'K.O.',
  'Server Cry',
  'Jesus Christ',
  'Horrible Happen',
  'Oh No',
];

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ type, path, input }) => {
          console.log('Error in', type, 'at', path, 'with input', input);
        }
      : ({ error }) => {
          console.error(
            `E: ${messages[Math.floor(Math.random() * messages.length)]} - ${error.message}`,
          );
        },
});
