import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '@/lib/db/queries/analytics';
import { sendContactEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, carId, carTitle, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get IP address for logging
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';

    // Save to database
    await saveContactSubmission(name, email, phone, carId, carTitle, message, ipAddress);

    // Send email
    await sendContactEmail(name, email, phone, carTitle, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 });
  }
}
