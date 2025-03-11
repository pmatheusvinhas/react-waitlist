import { NextResponse } from 'next/server';
import { createResendProxy } from 'react-waitlist/server';

// Create a proxy handler with your Resend API key
const proxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY || 'demo-api-key',
});

export async function POST(req: Request) {
  // For demo purposes, we'll simulate a successful response
  // In a real application, you would use the proxyHandler
  
  // Uncomment this line to use the actual proxy handler:
  // return proxyHandler(req, NextResponse);
  
  // Mock response for demo
  return NextResponse.json(
    {
      id: 'mock-audience-member-id',
      email: 'example@example.com',
      audienceId: 'demo-audience-id',
      createdAt: new Date().toISOString(),
    },
    { status: 200 }
  );
} 