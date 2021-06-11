export default {
  type: 'object',

  properties: {
    token: { type: 'string' },
    newPassword: { type: 'string' },
  },

  required: ['token', 'newPassword'],
} as const
