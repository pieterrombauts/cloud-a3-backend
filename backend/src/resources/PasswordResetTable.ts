export const PasswordResetTable = {
  Type: 'AWS::DynamoDB::Table',
  DeletionPolicy: 'Retain',
  Properties: {
    AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
    TimeToLiveSpecification: {
      AttributeName: 'TTL',
      Enabled: true,
    },
    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],

    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: '${self:provider.environment.PASSWORD_RESET_TABLE}',
  },
}
