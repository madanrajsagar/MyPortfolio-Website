import nodemailer from 'nodemailer';

// Create a transporter using direct SMTP or service-based config
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Nodemailer credentials missing. Email service running in MOCK mode.');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendContactEmail = async (contactDetails) => {
  const { name, email, subject, message } = contactDetails;
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #6366f1; border-radius: 4px; margin-top: 15px;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p style="font-size: 11px; color: #888; margin-top: 20px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
          This message was sent from your Premium Developer Portfolio Platform.
        </p>
      </div>
    `,
  };

  if (!transporter) {
    console.log('====== MOCK EMAIL SENT ======');
    console.log(`From: ${name} (${email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('=============================');
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer send failed:', error.message);
    throw new Error('Email delivery failed: ' + error.message);
  }
};
