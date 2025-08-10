import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('token')?.value;
  return NextResponse.json({ cookie });
}