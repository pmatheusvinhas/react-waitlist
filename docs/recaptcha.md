# reCAPTCHA Integration

The React Waitlist component supports Google reCAPTCHA v3 integration to protect your waitlist form from spam and abuse. This guide explains how to set up and use reCAPTCHA with your waitlist form.

## What is reCAPTCHA v3?

Google reCAPTCHA v3 helps protect your website from spam and abuse without user friction. It uses advanced risk analysis techniques to tell humans and bots apart, returning a score based on the interactions with your website. The higher the score, the more likely the user is human.

Unlike previous versions, reCAPTCHA v3 doesn't interrupt users with challenges. Instead, it runs silently in the background and provides you with a score that you can use to take appropriate action.

## Setting Up reCAPTCHA

### 1. Register Your Site

First, you need to register your site with Google reCAPTCHA:

1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click on the "+" button to add a new site
4. Choose "reCAPTCHA v3" as the type
5. Add your domain(s)
6. Accept the Terms of Service
7. Submit the form

You'll receive a **Site Key** and a **Secret Key**. Keep these secure.

### 2. Configure Your Waitlist Form

Add reCAPTCHA to your waitlist form by configuring the `security` prop:

```jsx
<WaitlistForm
  resendAudienceId="your_audience_id"
  resendProxyEndpoint="/api/resend-proxy"
  recaptchaProxyEndpoint="/api/recaptcha-proxy"
  
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: "your_recaptcha_site_key",
    reCaptchaMinScore: 0.5, // Optional, defaults to 0.5
    enableHoneypot: true,    // Optional additional protection
    checkSubmissionTime: true // Optional additional protection
  }}
  
  // Other props...
/>
```

### 3. Set Up the reCAPTCHA Proxy Endpoint

For security reasons, you should never expose your reCAPTCHA Secret Key in client-side code. Instead, create a proxy endpoint on your server to verify reCAPTCHA tokens:

#### Next.js API Route (Pages Router)

```javascript
// pages/api/recaptcha-proxy.js
import { createRecaptchaProxy } from 'react-waitlist/server';

export default createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5, // Optional, defaults to 0.5
  allowedActions: ['submit_waitlist'], // Optional, defaults to ['submit_waitlist']
});
```

#### Next.js App Router

```javascript
// app/api/recaptcha-proxy/route.js
import { NextResponse } from 'next/server';
import { createRecaptchaProxy } from 'react-waitlist/server';

const proxyHandler = createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
});

export async function POST(req) {
  const res = {
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code }),
    }),
  };
  return await proxyHandler(req, res);
}
```

#### Express.js

```javascript
// server.js
const express = require('express');
const { createRecaptchaProxy } = require('react-waitlist/server');
const app = express();

app.use(express.json());

app.post('/api/recaptcha-proxy', createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
}));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## How It Works

1. When a user submits the waitlist form, the component automatically executes reCAPTCHA in the background.
2. The reCAPTCHA script returns a token.
3. The component sends this token to your proxy endpoint for verification.
4. Your proxy endpoint verifies the token with Google's reCAPTCHA API.
5. If verification succeeds and the score is above the minimum threshold, the form submission proceeds.
6. If verification fails or the score is too low, the submission is rejected.

## Advanced Configuration

### Custom Score Threshold

You can adjust the minimum score threshold both on the client and server:

```jsx
// Client-side
<WaitlistForm
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: "your_recaptcha_site_key",
    reCaptchaMinScore: 0.7 // Higher threshold = stricter filtering
  }}
/>

// Server-side
createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.7, // Should match client-side setting
});
```

### Custom Error Handling

You can use the `onError` callback to handle reCAPTCHA verification failures:

```jsx
<WaitlistForm
  // reCAPTCHA configuration...
  
  onError={(data) => {
    console.error('Submission error:', data.error);
    // Custom error handling
  }}
/>
```

### Combining with Other Security Measures

For maximum protection, combine reCAPTCHA with other security features:

```jsx
<WaitlistForm
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: "your_recaptcha_site_key",
    enableHoneypot: true,
    checkSubmissionTime: true
  }}
/>
```

## Best Practices

1. **Never expose your Secret Key** in client-side code.
2. **Always use a proxy endpoint** for token verification.
3. **Set an appropriate score threshold** based on your risk tolerance.
4. **Monitor your reCAPTCHA dashboard** to adjust settings as needed.
5. **Combine reCAPTCHA with other security measures** for layered protection.

## Troubleshooting

### Common Issues

- **"reCAPTCHA not loaded"**: Ensure your site key is correct and the domain is registered in the reCAPTCHA admin console.
- **"Verification failed"**: Check that your secret key is correct and properly set in your environment variables.
- **Low scores for legitimate users**: Consider lowering your minimum score threshold.

### Testing in Development

During development, you can use test keys provided by Google:

- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These keys will always return a score of 0.9 for testing purposes.

## Privacy Considerations

When using reCAPTCHA, you should:

1. Update your privacy policy to disclose the use of reCAPTCHA.
2. Include information about data collection by Google.
3. Consider adding a small notice near your form indicating reCAPTCHA protection.

## Further Reading

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Understanding reCAPTCHA Scores](https://developers.google.com/recaptcha/docs/v3#interpreting_the_score)
- [reCAPTCHA FAQ](https://developers.google.com/recaptcha/docs/faq) 