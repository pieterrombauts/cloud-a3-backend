import 'source-map-support/register';

import {
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import schema from './schema';
import * as cuid from 'cuid';
import { UPLOADS_BUCKET_NAME } from '@resources/S3Bucket';

const getUploadLink: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  try {
    const s3 = new S3({
      region: 'ap-southeast-2',
      // useAccelerateEndpoint: true,
      signatureVersion: 'v4',
    });

    const fileName = event.body.fileName;
    const fileType = event.body.fileType;

    const fileExtension = fileName.split('.').pop();
    const s3Key = `${cuid()}.${fileExtension}`;

    const params = {
      Bucket: UPLOADS_BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      Expires: 1800,
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    return formatJSONResponse({
      signedUrl: signedUrl,
      key: s3Key,
    });
  } catch (error) {
    console.log(error);
    formatJSONError(new Error('Something went wrong. Please try again!'));
  }
};

export const main = middyfy(getUploadLink);
