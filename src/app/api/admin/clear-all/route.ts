import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // ลบข้อมูลที่เกี่ยวข้องกับ User ทั้งหมด
    await prisma.quizAnswer.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.user.deleteMany();
    
    // หมายเหตุ: เราไม่ลบ Checkpoint เพราะเป็นข้อมูลตั้งต้นของระบบ
    
    return NextResponse.json({ success: true, message: 'All user data cleared' });
  } catch (error) {
    console.error('Clear All Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
