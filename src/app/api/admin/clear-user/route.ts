import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ลบข้อมูลที่เกี่ยวข้องกับ User คนนี้เท่านั้น
    await prisma.quizAnswer.deleteMany({ where: { userId } });
    await prisma.userProgress.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    
    return NextResponse.json({ success: true, message: 'User data cleared' });
  } catch (error: any) {
    console.error('Clear User Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500 });
  }
}
