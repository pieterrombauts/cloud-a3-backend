import type { AWS } from '@serverless/typescript'

import { hello, register, login, authorizer } from '@functions/index'

const serverlessConfiguration: AWS = {
  service: 'auth',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  package: {
    exclude: ['node_modules/**'],
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-southeast-2',
    profile: 'cloud-computing-serverless-admin',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [
          'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.USERS_TABLE}',
          'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.USERS_TABLE}/index/*',
        ],
      },
    ],
    environment: {
      USERS_TABLE: 'users-${opt:stage, self:provider.stage}',
      JWT_SECRET:
        'ljljnalekjhvavskhdgfkjhcbivbakjysegcbukwyacvuaksdhfgeciysbaciyberaiubgbaskf',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },

  // import the function via paths
  functions: {
    hello,
    register,
    login,
    authorizer,
  },

  resources: {
    Resources: {
      UsersDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' },
          ],
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'email-index',
              KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
              Projection: {
                NonKeyAttributes: ['password'],
                ProjectionType: 'INCLUDE',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: '${self:provider.environment.USERS_TABLE}',
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
