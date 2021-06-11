export default {
  type: 'object',
  properties: {
    fileName: { type: 'string' },
    fileType: { type: 'string' },
  },
  required: ['fileName', 'fileType'],
} as const;
