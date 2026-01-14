import { NextRequest, NextResponse } from 'next/server';
import { trackCarView } from '@/lib/db/queries/analytics';

export async function POST(request: NextRequest) {
  try {
    const { carId } = await request.json();

    if (!carId) {
      return NextResponse.json({ error: 'Missing carId' }, { status: 400 });
    }

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    await trackCarView(carId, ipAddress, userAgent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
