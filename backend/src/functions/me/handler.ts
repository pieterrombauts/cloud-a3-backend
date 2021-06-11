import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'
import { getCurrentUser } from '@libs/authHelpers'

const me: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user = await getCurrentUser(event)

  delete user.password
  return formatJSONResponse({ ...user })
}

export const main = middyfy(me)
