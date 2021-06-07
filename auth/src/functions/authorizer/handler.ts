import 'source-map-support/register'

import { middyfy } from '@libs/lambda'

import jwt from 'jsonwebtoken'

const authorizer = async (event) => {
  try {
    const token = event.authorizationToken
    console.log(token)

    if (!token) {
      return generatePolicy('user', 'Deny', event.methodArn)
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return generatePolicy(userId, 'Allow', event.methodArn)
  } catch (error) {
    console.error(error)
    return generatePolicy('user', 'Deny', event.methodArn)
  }
}

var generatePolicy = function (
  principalId: any,
  effect: 'Allow' | 'Deny',
  resource: any,
) {
  var authResponse = {} as any

  authResponse.principalId = principalId
  if (effect && resource) {
    var policyDocument = {} as any
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    var statementOne = {} as any
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: 'stringval',
    numberKey: 123,
    booleanKey: true,
  }
  return authResponse
}

export const main = middyfy(authorizer)
