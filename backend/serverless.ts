import type { AWS } from '@serverless/typescript';

import * as Functions from '@functions/index';
import {
  UsersDynamoDbTable,
  PasswordResetTable,
  UploadsBucket,
  UploadsBucketAllowPublicReadPolicy,
} from '@resources/index';
import { UPLOADS_BUCKET_NAME } from '@resources/S3Bucket';

const serverlessConfiguration: AWS = {
  service: 'backend',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    customDomain: {
      domainName: 'api.satelitedata.io',
      basePath: '',
      stage: '${opt:stage, self:provider.stage}',
      createRoute53Record: true,
      hostedZoneId: 'Z047704046BCWPKKHWU4',
      certificateArn:
        'arn:aws:acm:us-east-1:509277504557:certificate/e407d307-535e-4ed2-855a-0dcf6bbf0626',
    },
  },
  package: {
    exclude: ['node_modules/**'],
  },
  plugins: ['serverless-webpack', 'serverless-domain-manager'],
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
          'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.PASSWORD_RESET_TABLE}',
        ],
      },
      {
        Effect: 'Allow',
        Action: ['ses:SendEmail', 'ses:SendRawEmail'],
        Resource: ['*'],
      },

      {
        Effect: 'Allow',
        Action: ['s3:putObject'],
        Resource: [`arn:aws:s3:::${UPLOADS_BUCKET_NAME}/*`],
      },
    ],
    environment: {
      USERS_TABLE: 'users-${opt:stage, self:provider.stage}',
      PASSWORD_RESET_TABLE: 'password-reset-${opt:stage, self:provider.stage}',
      FRONTEND_BASE_URL: 'satelitedata.io',
      JWT_SECRET:
        'ljljnalekjhvavskhdgfkjhcbivbakjysegcbukwyacvuaksdhfgeciysbaciyberaiubgbaskf',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },

  functions: Functions,

  resources: {
    Resources: {
      UsersDynamoDbTable,
      PasswordResetTable,
      UploadsBucket,
      UploadsBucketAllowPublicReadPolicy,
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
