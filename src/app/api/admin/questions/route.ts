import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Fetch questions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { checkpointId, questions } = body;

    if (checkpointId === undefined || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'checkpointId and questions are required' }, { status: 400 });
    }

    const cpId = parseInt(checkpointId);

    // Using a transaction to delete old questions and insert new ones
    // This allows bulk replace which makes reordering and editing simpler
    await prisma.$transaction(async (tx) => {
      await tx.question.deleteMany({
        where: { checkpointId: cpId },
      });

      if (questions.length > 0) {
        await tx.question.createMany({
          data: questions.map((q: any, idx: number) => ({
            checkpointId: cpId,
            text: q.text,
            type: q.type,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            order: idx, // Use array index for ordering
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save questions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
