import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { getCurrentUser } from '@libs/authHelpers';
import { getS3UrlFromKey } from '@libs/s3Helpers';

const me: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user = await getCurrentUser(event);

  delete user.password;
  return formatJSONResponse({
    ...user,
    avatar: getS3UrlFromKey(user.avatar),
  });
};

export const main = middyfy(me);
