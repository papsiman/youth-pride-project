import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ลบแค่ข้อมูลผลการทำกิจกรรม ไม่ลบ User
    await prisma.quizAnswer.deleteMany({ where: { userId } });
    await prisma.userProgress.deleteMany({ where: { userId } });
    
    // อัปเดตสถานะการลงทะเบียนกลับไปเป็น false ด้วยหรือไม่? (ถ้าลบคำตอบฐานแล้ว ควรถือว่ายังใหม่)
    // แต่เพื่อความปลอดภัย ขอแค่ลบประวัติการเล่นเท่านั้น
    
    return NextResponse.json({ success: true, message: 'User progress cleared' });
  } catch (error) {
    console.error('Clear Progress Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}
