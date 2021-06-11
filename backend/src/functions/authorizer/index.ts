import { handlerPath } from '@libs/handlerResolver';

export const authorizer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
};

export const useAuthorizer = {
  name: 'authorizer',
  resultTtlInSeconds: 0,
};
