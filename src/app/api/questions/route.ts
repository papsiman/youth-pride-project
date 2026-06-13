import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const checkpointId = searchParams.get('checkpointId');

  if (!checkpointId) {
    return NextResponse.json({ error: 'checkpointId is required' }, { status: 400 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { checkpointId: parseInt(checkpointId) },
      orderBy: { order: 'asc' },
    });
    
    // We send correctAnswer to client because the current client-side logic needs it to evaluate correctly.
    // In a more secure app, we wouldn't send the answer to the client.
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Fetch questions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
