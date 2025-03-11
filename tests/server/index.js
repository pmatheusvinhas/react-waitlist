const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

/**
 * Test server for React Waitlist integration tests
 * 
 * This server provides mock endpoints for:
 * - Resend API proxy
 * - reCAPTCHA verification proxy
 * - Webhook delivery proxy
 */
const app = express();
app.use(bodyParser.json());

// Resend proxy endpoint
app.post('/api/resend-proxy', async (req, res) => {
  try {
    const { audienceId, email, fields = {} } = req.body;
    
    // Validate required fields
    if (!audienceId || !email) {
      return res.status(400).json({
        error: 'Missing required fields: audienceId and email are required'
      });
    }
    
    // Check if using authorized test email
    if (email !== process.env.AUTHORIZED_TEST_EMAIL) {
      return res.status(403).json({
        error: 'For testing, only the authorized test email can be used'
      });
    }
    
    // Return mock successful response
    return res.status(200).json({
      id: 'test-audience-member-id',
      email,
      audienceId,
      createdAt: new Date().toISOString(),
      fields
    });
  } catch (error) {
    console.error('Resend proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// reCAPTCHA proxy endpoint
app.post('/api/recaptcha-proxy', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        error: 'Missing reCAPTCHA token'
      });
    }
    
    // For testing, we'll always return success with a high score
    // In a real environment, this would call the Google reCAPTCHA API
    return res.status(200).json({
      success: true,
      score: 0.9,
      action: 'submit_waitlist',
      challenge_ts: new Date().toISOString(),
      hostname: 'localhost'
    });
  } catch (error) {
    console.error('reCAPTCHA proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Webhook proxy endpoint
app.post('/api/webhook-proxy', async (req, res) => {
  try {
    const { url, payload, headers = {} } = req.body;
    
    if (!url || !payload) {
      return res.status(400).json({
        error: 'Missing required fields: url and payload'
      });
    }
    
    // Log the webhook request for testing
    console.log('Webhook received:', {
      url,
      payload,
      headers
    });
    
    // In tests, we don't actually call the external URL
    // Just return success
    return res.status(200).json({
      success: true,
      message: 'Webhook would be delivered in production'
    });
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Server management
let server;

module.exports = {
  /**
   * Start the test server
   * @param {number} port - Port to run the server on
   * @returns {object} - Server instance
   */
  start: (port = 3030) => {
    server = app.listen(port);
    console.log(`Test server running on port ${port}`);
    return server;
  },
  
  /**
   * Stop the test server
   */
  stop: () => {
    if (server) {
      server.close();
      console.log('Test server stopped');
    }
  },
  
  /**
   * Get the Express app instance
   * @returns {object} - Express app
   */
  app
}; 