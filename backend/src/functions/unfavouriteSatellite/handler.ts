import {
  formatJSONError,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getCurrentUser } from '@libs/authHelpers';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk';
import 'source-map-support/register';
import schema from './schema';

const dynamoDb = new DynamoDB.DocumentClient();

const unfavouriteSatellite: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    try {
      const user = await getCurrentUser(event);
      const satelliteToRemove = event.body;

      if (!user.favSatellites) {
        user.favSatellites = [];
      }

      const numFavBefore = user.favSatellites.length;
      user.favSatellites = user.favSatellites.filter(
        (satellite) => satellite.id !== satelliteToRemove.id,
      );

      if (numFavBefore === user.favSatellites.length) {
        return formatJSONResponse({ message: 'Satellite not in favourites' });
      }

      await dynamoDb
        .update({
          Key: { id: user.id },
          TableName: process.env.USERS_TABLE,
          UpdateExpression: 'set favSatellites = :satellites',
          ExpressionAttributeValues: {
            ':satellites': DynamoDB.Converter.input(user.favSatellites),
          },
        })
        .promise();

      return formatJSONResponse({ message: 'Successfully removed satellite!' });
    } catch (error) {
      console.error(error);
      return formatJSONError(
        new Error(
          'Failed to remove satellite to favourites. Please try again!',
        ),
      );
    }
  };

export const main = middyfy(unfavouriteSatellite);
