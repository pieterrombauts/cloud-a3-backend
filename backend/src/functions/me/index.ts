import { useAuthorizer } from '@functions/authorizer';
import { handlerPath } from '@libs/handlerResolver';

export const me = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        authorizer: useAuthorizer,
        cors: true,
        path: 'me',
      },
    },
  ],
};
