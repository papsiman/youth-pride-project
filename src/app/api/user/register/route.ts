import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineUserId, displayName, realName, phoneNumber } = body;

    if (!lineUserId || !realName || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { lineUserId },
      update: {
        realName,
        phoneNumber,
        registered: true,
      },
      create: {
        lineUserId,
        displayName,
        realName,
        phoneNumber,
        registered: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('API Register Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
