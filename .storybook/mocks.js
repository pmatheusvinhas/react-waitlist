import { http, HttpResponse } from 'msw';

// Define handlers for API mocks
export const handlers = [
  // Mock successful submission
  http.post('/api/resend-proxy', async ({ request }) => {
    // Parse the request body
    const body = await request.json();
    
    // Check for honeypot field (any field with _hp in the name)
    const honeypotField = Object.keys(body).find(key => key.includes('_hp'));
    if (honeypotField && body[honeypotField]) {
      console.warn('Bot detection triggered: Honeypot field filled', { field: honeypotField, value: body[honeypotField] });
      // Still return success to not alert bots
      return HttpResponse.json({
        id: 'mock-bot-submission-ignored',
        status: 'success',
        message: 'Submission received (but ignored due to bot detection)',
      }, { status: 200 });
    }
    
    // Check for submission time if provided
    if (body.formStartTime) {
      const submissionTime = Date.now() - body.formStartTime;
      if (submissionTime < 1500) { // Less than 1.5 seconds
        console.warn('Bot detection triggered: Submission too fast', { 
          submissionTimeMs: submissionTime,
          threshold: 1500
        });
        // Still return success to not alert bots
        return HttpResponse.json({
          id: 'mock-bot-submission-ignored',
          status: 'success',
          message: 'Submission received (but ignored due to bot detection)',
        }, { status: 200 });
      }
    }
    
    // Normal successful submission
    console.log('Form submitted successfully', body);
    return HttpResponse.json({
      id: 'mock-contact-id',
      email: body.email || 'test@example.com',
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      status: 'subscribed',
      createdAt: new Date().toISOString(),
    }, { status: 200 });
  }),
  
  // Add a handler for error testing if needed
  http.post('/api/resend-proxy-error', async () => {
    return HttpResponse.json({
      error: 'Invalid request',
      message: 'Failed to add contact',
    }, { status: 400 });
  }),
]; 