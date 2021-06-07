import { ValidatedAPIGatewayProxyEvent } from './apiGateway'
import { DynamoDB } from 'aws-sdk'

interface BasicUser {
  email: string
  password: string
  id: string
}

interface FullUser extends BasicUser {
  firstName: string
  lastName: string
}

export function getCurrentUserID(event: ValidatedAPIGatewayProxyEvent<any>) {
  return event.requestContext.authorizer.principalId
}

export async function getCurrentUser(
  event: ValidatedAPIGatewayProxyEvent<any>,
): Promise<FullUser | undefined> {
  const dynamoDb = new DynamoDB.DocumentClient()

  const params = {
    Key: {
      id: getCurrentUserID(event),
    },
    TableName: process.env.USERS_TABLE,
  }

  console.log(params)
  return (await dynamoDb.get(params).promise()).Item as FullUser | undefined
}

export async function getUserByEmail(
  email: string,
): Promise<BasicUser | undefined> {
  const dynamoDb = new DynamoDB.DocumentClient()

  const params = {
    TableName: process.env.USERS_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :v_email',
    ExpressionAttributeValues: {
      ':v_email': email,
    },
  }

  return (await dynamoDb.query(params).promise()).Items?.[0] as
    | BasicUser
    | undefined
}
