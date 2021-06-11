import 'source-map-support/register'

import {
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import { DynamoDB, SES } from 'aws-sdk'
import { getUserByEmail } from '@libs/authHelpers'
import * as crypto from 'crypto'
import { urlBase64EncodeObj } from '@libs/base64'

const dynamoDb = new DynamoDB.DocumentClient()
const ses = new SES({ region: 'ap-southeast-2' })

const forgotPassword: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    try {
      const user = await getUserByEmail(event.body.email.toLowerCase())

      if (!user) {
        return formatJSONError(new Error('Email address not found'))
      }

      const TTL = Math.round(new Date().getTime() / 1000) + 12 * 60 * 60 // 2 mins from now

      const userId = user.id
      const token = crypto.randomBytes(32).toString('base64')

      const params = {
        TableName: process.env.PASSWORD_RESET_TABLE,
        Item: { userId, token, TTL },
      }

      await dynamoDb.put(params).promise()

      const resetUrl =
        process.env.FRONTEND_BASE_URL +
        '/reset-password?token=' +
        urlBase64EncodeObj({ userId, token })

      const email = `
      <h2>Password Reset</h2>
      <p>You are receiving this email because we received a password request for your account</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you did not request a password reset, no further action is required</p>
      `

      await ses
        .sendEmail({
          Destination: {
            ToAddresses: [user.email],
          },
          Source: 'no-reply@satelitedata.io',
          Message: {
            Body: {
              Html: { Data: email },
            },
            Subject: {
              Data: 'Reset password',
            },
          },
        })
        .promise()

      return formatJSONResponse({
        resetToken: urlBase64EncodeObj({ userId, token }),
      })
    } catch (error) {
      console.error(error)
      formatJSONError(new Error('Something went wrong. Please try again!'))
    }
  }

export const main = middyfy(forgotPassword)
