import {
  formatJSONError,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway'
import { getCurrentUser } from '@libs/authHelpers'
import { middyfy } from '@libs/lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import schema from './schema'

const dynamoDb = new DynamoDB.DocumentClient()

const sameId = (object) => (currentObject) => {
  return currentObject.id === object.id
}

const favouriteSatellite: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    try {
      const user = await getCurrentUser(event)
      const satelliteToAdd = event.body

      if (!user.favSatellites) {
        user.favSatellites = []
      }

      if (user.favSatellites.some(sameId(satelliteToAdd))) {
        return formatJSONResponse({ message: 'Already in favourites!' })
      }

      user.favSatellites.push(satelliteToAdd)

      await dynamoDb
        .update({
          Key: { id: user.id },
          TableName: process.env.USERS_TABLE,
          UpdateExpression: 'set favSatellites = :satellites',
          ExpressionAttributeValues: {
            ':satellites': DynamoDB.Converter.input(user.favSatellites),
          },
        })
        .promise()

      return formatJSONResponse({ message: 'Successfully added satellite!' })
    } catch (error) {
      console.error(error)
      return formatJSONError(
        new Error('Failed to add satellite to favourites. Please try again!'),
      )
    }
  }

export const main = middyfy(favouriteSatellite)
