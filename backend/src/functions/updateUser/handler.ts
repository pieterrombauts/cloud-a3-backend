import {
  formatJSONError,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { convertUserToDynamoFormat, getCurrentUser } from '@libs/authHelpers';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk';
import 'source-map-support/register';
import schema from './schema';

const dynamoDb = new DynamoDB.DocumentClient();

const updateUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  try {
    const { firstName, lastName, email, avatar } = event.body;
    const user = await getCurrentUser(event);

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (email) {
      user.email = email;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await dynamoDb
      .put({
        TableName: process.env.USERS_TABLE,
        Item: convertUserToDynamoFormat(user),
      })
      .promise();

    return formatJSONResponse({ message: 'Successfully updated user!' });
  } catch (error) {
    console.error(error);
    return formatJSONError(
      new Error('Failed to update user. Please try again!'),
    );
  }
};

export const main = middyfy(updateUser);
