import schema from './schema'
import { handlerPath } from '@libs/handlerResolver'

export const resetPassword = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'resetPassword',
        cors: true,
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
