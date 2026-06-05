import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineUserId, checkpointId, completed, answers } = body;

    if (!lineUserId || checkpointId === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { lineUserId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. บันทึกความคืบหน้าของด่าน
    console.log('Upserting progress for user:', user.id, 'at checkpoint:', checkpointId);
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_checkpointId: {
          userId: user.id,
          checkpointId: parseInt(checkpointId as string),
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: user.id,
        checkpointId: parseInt(checkpointId as string),
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // 2. บันทึกคำตอบแต่ละข้อ (ถ้าส่งมา)
    if (answers && Array.isArray(answers)) {
      console.log('Saving quiz answers for checkpoint:', checkpointId);
      try {
        // ลบคำตอบเก่าของฐานนี้ออกก่อน (ถ้ามี) เพื่อป้องกัน Error หรือข้อมูลซ้ำ
        await prisma.quizAnswer.deleteMany({
          where: {
            userId: user.id,
            checkpointId: parseInt(checkpointId as string),
          }
        });

        await prisma.quizAnswer.createMany({
          data: answers.map((ans: any) => ({
            userId: user.id,
            checkpointId: parseInt(checkpointId as string),
            questionIdx: ans.questionIdx,
            userAnswer: ans.userAnswer,
            isCorrect: ans.isCorrect,
          })),
        });
      } catch (answerError) {
        console.error('Failed to save quiz answers, but proceeding:', answerError);
        // เรายอมให้บันทึกคะแนนไม่สำเร็จ ดีกว่าปล่อยให้หน้าจอค้าง
      }
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('API Progress Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
