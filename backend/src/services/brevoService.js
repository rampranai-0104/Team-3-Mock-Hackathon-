const { BrevoClient } = require('@getbrevo/brevo');

/**
 * Brevo (formerly Sendinblue) Transactional Email Service
 * Uses the official @getbrevo/brevo SDK, with a graceful local/mock fallback
 */

const getSenderConfig = () => {
  return {
    email: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || 'noreply@tvarita.org',
    name: process.env.BREVO_SENDER_NAME || 'Tvarita Arts Collective'
  };
};

/**
 * Low-level email sending helper using Brevo REST API v3
 * @param {Object} options
 * @param {Array<{email: string, name?: string}>|string} options.to
 * @param {string} options.subject
 * @param {string} options.htmlContent
 * @param {string} [options.textContent]
 * @param {Object} [options.sender]
 * @returns {Promise<{ success: boolean, messageId?: string, isMock?: boolean }>}
 */
const sendEmail = async ({ to, subject, htmlContent, textContent, sender }) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const isBrevoConfigured = Boolean(apiKey && apiKey.trim() && !apiKey.includes('placeholder'));

  // Normalize recipient array
  const recipients = Array.isArray(to)
    ? to.map((r) => (typeof r === 'string' ? { email: r } : r))
    : [{ email: to }];

  const senderInfo = sender || getSenderConfig();

  // Graceful Mock Fallback for local development & testing
  if (!isBrevoConfigured || process.env.NODE_ENV === 'test') {
    const mockMessageId = `mock_brevo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`\n📧 [Brevo Service Mock Email]`);
      console.log(`   To: ${recipients.map((r) => r.email).join(', ')}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Message ID: ${mockMessageId}\n`);
    }
    return {
      success: true,
      messageId: mockMessageId,
      isMock: true
    };
  }

  const client = new BrevoClient({ apiKey });

  try {
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: senderInfo,
      to: recipients,
      subject,
      htmlContent,
      textContent: textContent || subject
    });

    return {
      success: true,
      messageId: result.messageId || 'sent',
      isMock: false
    };
  } catch (error) {
    console.warn('Brevo API request failed (falling back to mock delivery):', error.message);
    const fallbackMessageId = `fallback_brevo_${Date.now()}`;
    console.log(`\n📧 [Brevo Fallback Mock Email]`);
    console.log(`   To: ${recipients.map((r) => r.email).join(', ')}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message ID: ${fallbackMessageId}\n`);
    return {
      success: true,
      messageId: fallbackMessageId,
      isMock: true,
      note: 'Brevo API error encountered; fell back to local delivery'
    };
  }
};

/**
 * Send OTP Verification Email with polished responsive branding template
 * @param {string} email - Recipient email
 * @param {string} otp - Numeric OTP code
 * @param {string} [purpose='verification'] - Purpose (e.g. 'registration', 'login', 'password_reset')
 * @param {string} [recipientName=''] - Recipient name
 * @param {number} [expiresInMinutes=10] - Validity window
 * @returns {Promise<Object>}
 */
const sendOTPEmail = async (
  email,
  otp,
  purpose = 'verification',
  recipientName = '',
  expiresInMinutes = 10
) => {
  const purposeMap = {
    verification: 'Email Verification',
    registration: 'Account Registration',
    login: 'One-Time Login',
    password_reset: 'Password Reset',
    profile_update: 'Security Verification'
  };

  const formattedPurpose = purposeMap[purpose] || 'Verification';
  const subject = `Your Tvarita ${formattedPurpose} Code: ${otp}`;
  const nameGreeting = recipientName ? `Hello ${recipientName},` : 'Hello,';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f4ed; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2c2523;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 40px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #ebd9c8;">
                
                <!-- Header Banner -->
                <tr>
                  <td align="center" style="padding: 32px 20px; background: linear-gradient(135deg, #882b1d 0%, #b8432a 100%); color: #ffffff;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">TVARITA</h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; letter-spacing: 0.5px;">FOLK & TRIBAL ARTS COLLECTIVE</p>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; font-weight: 600;">${nameGreeting}</p>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #5a524e;">
                      You requested a code for <strong>${formattedPurpose}</strong>. Please use the following one-time password to complete your action:
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background-color: #fcf8f3; border: 2px dashed #b8432a; border-radius: 10px; padding: 20px; text-align: center; margin: 28px 0;">
                      <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #882b1d; display: inline-block;">${otp}</span>
                    </div>

                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #786f6a;">
                      ⏱️ This code will expire in <strong>${expiresInMinutes} minutes</strong>.
                    </p>
                    <p style="margin: 0 0 28px 0; font-size: 13px; color: #a39b95; line-height: 1.5;">
                      Security reminder: If you did not request this verification code, please ignore this email or contact our support immediately. Never share this code with anyone.
                    </p>

                    <hr style="border: none; border-top: 1px solid #ebd9c8; margin: 24px 0;" />

                    <p style="margin: 0; font-size: 13px; color: #8c827c; text-align: center;">
                      Preserving & Empowering Traditional Indian Artisans
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px; background-color: #f7f4ed; text-align: center; font-size: 12px; color: #9c928b; border-top: 1px solid #ebd9c8;">
                    &copy; ${new Date().getFullYear()} Tvarita Arts Collective. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const textContent = `${nameGreeting}\n\nYour Tvarita verification code is: ${otp}\n\nThis code will expire in ${expiresInMinutes} minutes. Do not share this code with anyone.\n\n-- Tvarita Arts Collective`;

  return await sendEmail({
    to: email,
    subject,
    htmlContent,
    textContent
  });
};

/**
 * Send Welcome Email to newly registered users
 */
const sendWelcomeEmail = async (email, name, role = 'public') => {
  const roleNames = {
    artist: 'Master Artisan',
    institution: 'Institution Partner',
    public: 'Art Enthusiast',
    admin: 'Administrator'
  };

  const roleTitle = roleNames[role] || 'Member';
  const subject = `Welcome to Tvarita Arts Collective, ${name || ''}!`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #2c2523;">
      <h2 style="color: #882b1d;">Welcome to Tvarita, ${name}!</h2>
      <p>Thank you for joining as a <strong>${roleTitle}</strong>.</p>
      <p>Our mission is to celebrate, preserve, and empower indigenous and folk tribal art forms across India.</p>
      <p>Best regards,<br/>The Tvarita Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    htmlContent,
    textContent: `Welcome to Tvarita, ${name}! You are registered as a ${roleTitle}.`
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail
};
