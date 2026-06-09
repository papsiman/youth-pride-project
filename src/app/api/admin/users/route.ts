import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        displayName: true,
        realName: true,
        phoneNumber: true,
        createdAt: true,
        _count: {
          select: { progress: true }
        }
      }
    });
    
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
