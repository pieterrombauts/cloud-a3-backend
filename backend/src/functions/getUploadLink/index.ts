import { useAuthorizer } from '@functions/authorizer';
import { handlerPath } from '@libs/handlerResolver';

export const getUploadLink = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        authorizer: useAuthorizer,
        cors: true,
        path: 'getUploadLink',
      },
    },
  ],
};
