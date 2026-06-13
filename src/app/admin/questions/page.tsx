'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, Trash2, GripVertical, Save, CheckCircle2, XCircle } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Question {
  id: string; // Temporary ID for new ones, or real ID from DB
  checkpointId: number;
  text: string;
  type: 'yesno' | 'choice';
  options: string[];
  correctAnswer: string;
}

const CHECKPOINTS = [
  { id: 1, name: 'ฐานที่ 1' },
  { id: 2, name: 'ฐานที่ 2' },
  { id: 3, name: 'ฐานที่ 3' },
];

function SortableQuestionItem({
  question,
  index,
  updateQuestion,
  removeQuestion,
}: {
  question: Question;
  index: number;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  removeQuestion: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateOption = (optIndex: number, val: string) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = val;
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
    >
      <div style={{ display: 'flex', gap: '16px', padding: '16px', alignItems: 'flex-start' }}>
        <div {...listeners} style={{ cursor: 'grab', marginTop: '12px' }}>
          <GripVertical size={24} color="var(--text-muted)" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>ข้อ {index + 1}</span>
            <input
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
              className="input-field"
              placeholder="คำถาม..."
              style={{ flex: 1 }}
            />
            <button onClick={() => removeQuestion(question.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>ประเภท:</label>
            <select
              value={question.type}
              onChange={(e) => {
                const type = e.target.value as 'yesno' | 'choice';
                updateQuestion(question.id, {
                  type,
                  correctAnswer: type === 'yesno' ? 'true' : '0',
                  options: type === 'yesno' ? [] : ['', '', '', ''],
                });
              }}
              className="input-field"
              style={{ width: '150px' }}
            >
              <option value="yesno">ถูก/ผิด (Yes/No)</option>
              <option value="choice">ตัวเลือก (Choice)</option>
            </select>
          </div>

          {question.type === 'yesno' ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>คำตอบที่ถูกต้อง:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => updateQuestion(question.id, { correctAnswer: 'true' })}
                  className="btn-primary"
                  style={{
                    background: question.correctAnswer === 'true' ? '#10b981' : 'transparent',
                    color: question.correctAnswer === 'true' ? '#fff' : 'var(--text-main)',
                    border: '1px solid #10b981',
                    padding: '8px 16px',
                  }}
                >
                  <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  ใช่
                </button>
                <button
                  onClick={() => updateQuestion(question.id, { correctAnswer: 'false' })}
                  className="btn-primary"
                  style={{
                    background: question.correctAnswer === 'false' ? '#ef4444' : 'transparent',
                    color: question.correctAnswer === 'false' ? '#fff' : 'var(--text-main)',
                    border: '1px solid #ef4444',
                    padding: '8px 16px',
                  }}
                >
                  <XCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  ไม่ใช่
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>ตัวเลือกและคำตอบ:</label>
              {question.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name={`correct_${question.id}`}
                    checked={question.correctAnswer === i.toString()}
                    onChange={() => updateQuestion(question.id, { correctAnswer: i.toString() })}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="input-field"
                    placeholder={`ตัวเลือกที่ ${i + 1}`}
                    style={{ flex: 1 }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuestionsAdmin() {
  const router = useRouter();
  const [activeCheckpoint, setActiveCheckpoint] = useState<number>(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchQuestions(activeCheckpoint);
  }, [activeCheckpoint]);

  const fetchQuestions = async (checkpointId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/questions?checkpointId=${checkpointId}`);
      if (res.ok) {
        const data = await res.json();
        // Use real ID or generate a temp one if none
        const mapped = data.map((q: any) => ({ ...q, id: q.id || Math.random().toString(36).substring(7) }));
        setQuestions(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: Math.random().toString(36).substring(7),
      checkpointId: activeCheckpoint,
      text: '',
      type: 'yesno',
      options: [],
      correctAnswer: 'true',
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const saveQuestions = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkpointId: activeCheckpoint,
          questions,
        }),
      });
      if (res.ok) {
        alert('บันทึกข้อมูลเรียบร้อยแล้ว');
        fetchQuestions(activeCheckpoint); // reload
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>จัดการคำถาม - คำตอบ</h1>
      </header>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {CHECKPOINTS.map((cp) => (
          <button
            key={cp.id}
            onClick={() => setActiveCheckpoint(cp.id)}
            className="btn-primary"
            style={{
              flex: 1,
              background: activeCheckpoint === cp.id ? 'var(--primary)' : 'var(--input-bg)',
              color: activeCheckpoint === cp.id ? '#fff' : 'var(--text-main)',
            }}
          >
            {cp.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>คำถามของฐานที่ {activeCheckpoint}</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={addQuestion} className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px' }}>
            <Plus size={18} /> เพิ่มคำถาม
          </button>
          <button onClick={saveQuestions} disabled={saving} className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px', background: '#10b981' }}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} บันทึก
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={40} className="animate-spin" color="var(--primary)" />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {questions.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ยังไม่มีคำถามในฐานนี้ กดเพิ่มคำถามเพื่อเริ่มต้น
                </div>
              ) : (
                questions.map((q, index) => (
                  <SortableQuestionItem
                    key={q.id}
                    question={q}
                    index={index}
                    updateQuestion={updateQuestion}
                    removeQuestion={removeQuestion}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </main>
  );
}
