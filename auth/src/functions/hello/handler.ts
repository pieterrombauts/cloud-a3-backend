import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'
import { getCurrentUser, getCurrentUserID } from '@libs/authHelpers'

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const user = await getCurrentUser(event)

  return formatJSONResponse({
    message: `Hello ${user.firstName}!`,
  })
}

export const main = middyfy(hello)
