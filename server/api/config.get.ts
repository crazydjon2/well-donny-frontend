import { defineEventHandler } from '#imports'

export default defineEventHandler(() => {
  return {
    // eslint-disable-next-line node/prefer-global/process
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // eslint-disable-next-line node/prefer-global/process
    userTgId: process.env.USER_TG_ID || '0',
  }
})
