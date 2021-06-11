import schema from './schema'
import { handlerPath } from '@libs/handlerResolver'

export const forgotPassword = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'forgotPassword',
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
