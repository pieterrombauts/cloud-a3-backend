import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
import { useAuthorizer } from '@functions/authorizer';

export const updateUser = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'updateUser',
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
