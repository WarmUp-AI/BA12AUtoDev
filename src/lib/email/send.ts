import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendContactEmail(
  name: string,
  email: string,
  phone: string | undefined,
  carTitle: string | undefined,
  message: string
) {
  const emailFrom = process.env.EMAIL_FROM || 'sales@ba12automotive.co.uk';
  const emailTo = process.env.EMAIL_TO || 'sales@ba12automotive.co.uk';

  // Get the Resend client (lazy initialization)
  const client = getResendClient();

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    ${carTitle ? `<p><strong>Interested in:</strong> ${carTitle}</p>` : ''}
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    await client.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: carTitle ? `Enquiry about ${carTitle}` : 'New Contact Form Submission',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
