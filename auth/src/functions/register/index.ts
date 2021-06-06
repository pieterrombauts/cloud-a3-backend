import schema from './schema'
import { handlerPath } from '@libs/handlerResolver'

export const register = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'register',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
