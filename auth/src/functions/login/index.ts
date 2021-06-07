import schema from './schema'
import { handlerPath } from '@libs/handlerResolver'

export const login = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'login',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
