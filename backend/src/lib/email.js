const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"EventHub" <noreply@eventhub.com>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // fallback plain text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[EMAIL] Failed to send to ${to}:`, err.message);
    throw err;
  }
};

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to EventHub!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#6366f1">Welcome to EventHub, ${name}!</h1>
        <p>Your account has been created. Start exploring amazing events today.</p>
        <a href="${process.env.FRONTEND_URL}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Browse Events</a>
      </div>
    `,
  }),

  emailVerification: (name, token) => ({
    subject: 'Verify your EventHub email',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#6366f1">Verify your email</h1>
        <p>Hi ${name}, click below to verify your email address.</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Verify Email</a>
        <p style="color:#888;margin-top:16px;font-size:12px">This link expires in 24 hours.</p>
      </div>
    `,
  }),

  passwordReset: (name, token) => ({
    subject: 'Reset your EventHub password',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#6366f1">Reset your password</h1>
        <p>Hi ${name}, click below to reset your password.</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Reset Password</a>
        <p style="color:#888;margin-top:16px;font-size:12px">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  }),

  ticketConfirmation: (name, event, ticketCode, qrCodeUrl) => ({
    subject: `Your ticket for ${event.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#6366f1">You're registered!</h1>
        <p>Hi ${name}, your registration for <strong>${event.title}</strong> is confirmed.</p>
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0">
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleString()}</p>
          <p><strong>Venue:</strong> ${event.venue}, ${event.city}</p>
          <p><strong>Ticket Code:</strong> <code>${ticketCode}</code></p>
        </div>
        ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" style="width:200px;height:200px" />` : ''}
        <p style="color:#888;font-size:12px;margin-top:16px">Show this QR code at the venue for check-in.</p>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
