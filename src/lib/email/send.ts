import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  name: string,
  email: string,
  phone: string | undefined,
  carTitle: string | undefined,
  message: string
) {
  const emailFrom = process.env.EMAIL_FROM || 'sales@ba12automotive.co.uk';
  const emailTo = process.env.EMAIL_TO || 'sales@ba12automotive.co.uk';

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
    await resend.emails.send({
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
