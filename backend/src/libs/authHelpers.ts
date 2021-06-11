import { ValidatedAPIGatewayProxyEvent } from './apiGateway';
import { DynamoDB } from 'aws-sdk';
import { userInfo } from 'os';

interface BasicUser {
  email: string;
  password: string;
  id: string;
}

interface Satellite {
  id: string;
  name: string;
}
interface FullUser extends BasicUser {
  firstName: string;
  lastName: string;
  avatar?: string;
  favSatellites?: Satellite[];
}

export function getCurrentUserID(event: ValidatedAPIGatewayProxyEvent<any>) {
  return event.requestContext.authorizer.principalId;
}

export async function getCurrentUser(
  event: ValidatedAPIGatewayProxyEvent<any>,
): Promise<FullUser | undefined> {
  const dynamoDb = new DynamoDB.DocumentClient();

  const params = {
    Key: {
      id: getCurrentUserID(event),
    },
    TableName: process.env.USERS_TABLE,
  };

  console.log(params);
  const user = (await dynamoDb.get(params).promise()).Item;

  if (user.favSatellites) {
    user.favSatellites = DynamoDB.Converter.output(user.favSatellites);
  }

  return user as FullUser;
}

export function convertUserToDynamoFormat(user: FullUser): Record<any, any> {
  const output: Record<any, any> = { ...user };

  if (user.favSatellites) {
    output.favSatellites = DynamoDB.Converter.input(user.favSatellites);
  }

  return output;
}

export async function getUserByEmail(
  email: string,
): Promise<BasicUser | undefined> {
  const dynamoDb = new DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USERS_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :v_email',
    ExpressionAttributeValues: {
      ':v_email': email,
    },
  };

  return (await dynamoDb.query(params).promise()).Items?.[0] as
    | BasicUser
    | undefined;
}

export async function isResetTokenValid(userId: string, token: string) {
  const dynamoDb = new DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.PASSWORD_RESET_TABLE,
    Key: { userId: userId },
  };

  const record = (await dynamoDb.get(params).promise()).Item;

  if (!record || isExpired(record.TTL)) {
    return false;
  }

  if (record.token === token) {
    return true;
  }

  return false;
}

function isExpired(ttl: number) {
  return new Date().getTime() / 1000 > ttl;
}
