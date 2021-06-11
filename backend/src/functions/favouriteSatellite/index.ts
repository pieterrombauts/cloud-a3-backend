import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
import { useAuthorizer } from '@functions/authorizer';

export const favouriteSatellite = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'favouriteSatellite',
        authorizer: useAuthorizer,
        cors: true,
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
