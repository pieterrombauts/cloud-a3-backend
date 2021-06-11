export const UPLOADS_BUCKET_NAME = 'satelitedata-io-uploads';

export const UploadsBucket = {
  Type: 'AWS::S3::Bucket',
  Properties: {
    BucketName: UPLOADS_BUCKET_NAME,

    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      BlockPublicPolicy: false,
      IgnorePublicAcls: false,
      RestrictPublicBuckets: false,
    },

    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        { ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } },
      ],
    },

    VersioningConfiguration: { Status: 'Enabled' },
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT'],
          AllowedOrigins: ['*'],
          Id: 'CORSRuleId1',
          MaxAge: '3600',
        },
      ],
    },
  },
};

export const UploadsBucketAllowPublicReadPolicy = {
  Type: 'AWS::S3::BucketPolicy',
  Properties: {
    Bucket: { Ref: 'UploadsBucket' },
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject', 's3:GetObjectVersion'],
          Resource: [`arn:aws:s3:::${UPLOADS_BUCKET_NAME}/*`],
        },
      ],
    },
  },
};
