import { NextRequest, NextResponse } from 'next/server';
import { createResendProxy } from '../../../../src/server';

// Create a proxy handler for Resend API
const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY || 'your-api-key',
  allowedAudiences: ['your-audience-id'],
  rateLimit: {
    max: 10, // Maximum 10 requests
    windowSec: 60, // Per minute
  },
});

// Handle POST requests
export async function POST(req: NextRequest) {
  // Create a simple response object compatible with the proxy handler
  const res = {
    status: (code: number) => ({
      json: (data: any) => NextResponse.json(data, { status: code }),
    }),
  };

  // Call the proxy handler
  return await proxyHandler(req, res);
} 