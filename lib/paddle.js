import 'server-only'

import { Environment, Paddle } from '@paddle/paddle-node-sdk'

let paddleClient

export function getPaddleClient() {
  if (paddleClient) return paddleClient

  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) throw new Error('PADDLE_API_KEY is not configured')

  paddleClient = new Paddle(apiKey, {
    environment: process.env.PADDLE_ENVIRONMENT === 'production'
      ? Environment.production
      : Environment.sandbox,
  })

  return paddleClient
}

export function getPaddleApiBaseUrl() {
  return process.env.PADDLE_ENVIRONMENT === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com'
}
