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
      },
    });

    if (!user) {
      return NextResponse.json({ registered: false });
    }

    // Get all checkpoints to ensure we return status for all
    const allCheckpoints = await prisma.checkpoint.findMany();
    
    const progressStatus = allCheckpoints.map(cp => {
      const userCp = user.progress.find(p => p.checkpointId === cp.id);
      return {
        checkpointId: cp.id,
        name: cp.name,
        completed: userCp?.completed || false,
        completedAt: userCp?.completedAt || null,
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
    });
  } catch (error) {
    console.error('API Status Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
