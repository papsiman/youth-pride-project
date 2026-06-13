import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lineUserId = searchParams.get('lineUserId');

  if (!lineUserId) {
    return NextResponse.json({ error: 'lineUserId is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { lineUserId },
      include: {
        progress: {
          include: {
            checkpoint: true,
          },
        },
        quizAnswers: true,
        feedback: true,
      },
    });

    if (!user) {
      return NextResponse.json({ registered: false });
    }

    const allCheckpoints = await prisma.checkpoint.findMany({
      include: {
        questions: true,
      }
    });
    
    const progressStatus = allCheckpoints.map(cp => {
      const userCp = user.progress.find(p => p.checkpointId === cp.id);
      const answersForCp = user.quizAnswers.filter(a => a.checkpointId === cp.id);
      const correctCount = answersForCp.filter(a => a.isCorrect).length;

      return {
        checkpointId: cp.id,
        name: cp.name,
        completed: userCp?.completed || false,
        completedAt: userCp?.completedAt || null,
        score: correctCount,
        total: (cp as any).questions?.length > 0 ? (cp as any).questions.length : (cp.id === 3 ? 10 : 5)
      };
    });


    return NextResponse.json({
      registered: user.registered,
      user: {
        displayName: user.displayName,
        realName: user.realName,
        phoneNumber: user.phoneNumber,
      },
      progress: progressStatus,
      feedback: user.feedback,
    });
  } catch (error) {
    console.error('API Status Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
