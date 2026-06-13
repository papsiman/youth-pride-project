'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLiff } from '@/providers/LiffProvider';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, Sparkles, Trophy } from 'lucide-react';

interface Question {
  text: string;
  type: 'yesno' | 'choice';
  options?: string[]; // สำหรับแบบ choice [ก, ข, ค, ง]
  correctAnswer: string; // เก็บเป็น 'true'/'false' หรือ '0'/'1'/'2'/'3'
}

const QUESTIONS_DATA: Record<number, Question[]> = {
  1: [
    { text: "ท้องในวัยเรียนสามารถเรียนต่อได้โดยไม่ถูกไล่ออก", type: 'yesno', correctAnswer: 'true' },
    { text: "หากตั้งครรภ์ไม่พร้อม สามารถขอคำปรึกษาจากคลินิกวัยรุ่นของโรงพยาบาลทุกแห่งในเขตสุขภาพที่ 7 หรือโทรสายด่วน 1663", type: 'yesno', correctAnswer: 'true' },
    { text: "การคุมกำเนิดที่เหมาะสมกับวันรุ่น คือ ยาฝังคุมกำเนิด ชนิด 1 หลอดคุมกำเนิดได้ 3 ปี ฝังฟรีทุกสิทธิ์ ทุกโรงพยาบาลอายุ 10 ปีขึ้นไปไม่ต้องขออนุญาตผู้ปกครอง", type: 'yesno', correctAnswer: 'true' },
    { text: "วัยรุ่นสามารถเข้าถึงบริการสุขภาพทางเพศได้โดยไม่ถูกเลือกปฏิบัติและเป็นความลับ", type: 'yesno', correctAnswer: 'true' },
    { text: "หากวัยรุ่นตั้งครรภ์รู้สึกอับอายไม่อยากอยู่บ้านสามารถขอไปอยู่บ้านพักเด็กได้โดยไม่มีค่าใช้จ่าย", type: 'yesno', correctAnswer: 'true' },
  ],
  3: [
    { text: "กรมสุขภาพจิตอยู่ภายใต้กระทรวงสาธารณสุข", type: 'yesno', correctAnswer: 'true' },
    { text: "คนที่ยิ้มเก่งตลอดเวลา จะไม่มีความเครียดเลย", type: 'yesno', correctAnswer: 'false' },
    { text: "การนอนหลับไม่เพียงพอ อาจส่งผลต่อสุขภาพจิตได้", type: 'yesno', correctAnswer: 'true' },
    { text: "กรมสุขภาพจิตมีหน้าที่ดูแลเฉพาะผู้ป่วยในโรงพยาบาลเท่านั้น", type: 'yesno', correctAnswer: 'false' },
    { text: "การออกกำลังกายช่วยลดความเครียดได้", type: 'yesno', correctAnswer: 'true' },
    { text: "หากรู้สึกเครียดมาก ควรเก็บไว้คนเดียวและไม่ต้องบอกใคร", type: 'yesno', correctAnswer: 'false' },
    { text: "เด็กและผู้สูงอายุสามารถมีปัญหาสุขภาพจิตได้ทั้งคู่", type: 'yesno', correctAnswer: 'true' },
    { text: "การบูลลี่กันในโลกออนไลน์ไม่ส่งผลต่อสุขภาพจิต", type: 'yesno', correctAnswer: 'false' },
    { text: "กรมสุขภาพจิตมีการรณรงค์ส่งเสริมสุขภาพจิตในชุมชน", type: 'yesno', correctAnswer: 'true' },
    { text: "การขอคำปรึกษาจากนักจิตวิทยาหรือจิตแพทย์เป็นเรื่องปกติ", type: 'yesno', correctAnswer: 'true' },
  ],
  2: [
    { 
      text: "HIV ทำลายระบบใดของร่างกาย", 
      type: 'choice', 
      options: ["ก. ระบบย่อยอาหาร", "ข. ระบบภูมิคุ้มกัน", "ค. ระบบหายใจ", "ง. ระบบกล้ามเนื้อ"], 
      correctAnswer: '1' 
    },
    { 
      text: "ข้อใดเป็นวิธีป้องกันโรคติดต่อทางเพศสัมพันธ์ที่ดีที่สุด", 
      type: 'choice', 
      options: ["ก. ล้างมือหลังมีเพศสัมพันธ์", "ข. ใช้ถุงยางอนามัยทุกครั้ง", "ค. อาบน้ำทันทีหลังมีเพศสัมพันธ์", "ง. กินวิตามินทุกวัน"], 
      correctAnswer: '1' 
    },
    { 
      text: "ข้อใดไม่ใช่โรคติดต่อทางเพศสัมพันธ์", 
      type: 'choice', 
      options: ["ก. ซิฟิลิส", "ข. หนองใน", "ค. ไข้เลือดออก", "ง. เริม"], 
      correctAnswer: '2' 
    },
    { 
      text: "ถุงยางอนามัยช่วยป้องกันอะไรได้", 
      type: 'choice', 
      options: ["ก. โรคติดต่อทางเพศสัมพันธ์", "ข. การตั้งครรภ์", "ค. HIV", "ง. ถูกทุกข้อ"], 
      correctAnswer: '3' 
    },
    { 
      text: "PrEP คืออะไร", 
      type: 'choice', 
      options: ["ก. ยาป้องกัน HIV ก่อนสัมผัสเชื้อ", "ข. ยารักษาไข้หวัด", "ค. วัคซีนโรคเอดส์", "ง. ยาฆ่าเชื้อแบคทีเรีย"], 
      correctAnswer: '0' 
    },
  ]
};

export default function Quiz() {
  const { id } = useParams();
  const checkpointId = Number(id);
  const { profile, isLoggedIn, liff } = useLiff();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [latestScore, setLatestScore] = useState<number>(0);
  const [latestTotal, setLatestTotal] = useState<number>(0);
  const [checkpointName, setCheckpointName] = useState(`ฐานที่ ${id}`);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/');
    } else if (isLoggedIn && profile) {
      checkUserAndCheckpointStatus();
      fetchQuestions();
      if (liff?.isInClient()) {
        const sent = sessionStorage.getItem(`sent_msg_quiz_${checkpointId}`);
        if (!sent) {
          liff.sendMessages([{ type: 'text', text: `เข้าฐานที่ ${checkpointId}` }]).catch(e => console.log('Send msg error:', e));
          sessionStorage.setItem(`sent_msg_quiz_${checkpointId}`, 'true');
        }
      }
    }
  }, [isLoggedIn, profile, router, id, checkpointId, liff]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/questions?checkpointId=${checkpointId}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const checkUserAndCheckpointStatus = async () => {
    try {
      const res = await fetch(`/api/user/status?lineUserId=${profile.userId}`);
      const data = await res.json();
      
      if (!data.registered) {
        router.replace('/register');
        return;
      }

      const checkpoint = data.progress?.find((p: any) => p.checkpointId === checkpointId);
      if (checkpoint) {
        setCheckpointName(checkpoint.name);
        if (checkpoint.completed) {
          setAlreadyCompleted(true);
          setLatestScore(checkpoint.score || 0);
          setLatestTotal(checkpoint.total || 0);
        }
      }
    } catch (error) {
      console.error('Check status error:', error);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: string[]) => {
    if (!profile) return;
    setSubmitting(true);
    
    const results = finalAnswers.map((ans, idx) => {
      const question = questions[idx];
      return {
        questionIdx: idx,
        userAnswer: ans,
        isCorrect: question ? (ans === question.correctAnswer) : false
      };
    });

    setScore(results.filter(r => r.isCorrect).length);

    try {
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineUserId: profile.userId,
          checkpointId: checkpointId,
          completed: true,
          answers: results
        }),
      });

      if (res.ok) {
        setCompleted(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`ไม่สามารถบันทึกข้อมูลได้: ${errorData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Submit progress error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อครับ');
    } finally {
      setSubmitting(false);
    }
  };

  const closeLiff = () => {
    if (liff && liff.isInClient()) {
      liff.closeWindow();
    } else {
      alert("คำสั่งปิดจะทำงานเมื่อเปิดผ่านแอป LINE เท่านั้นครับ");
    }
  };

  if (alreadyCompleted) {
    return (
      <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', width: '100%', maxWidth: '400px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fbbf24' }}>
            <Trophy size={40} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>ทำสำเร็จแล้ว!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>คุณได้ทำภารกิจใน {checkpointName} เรียบร้อยแล้ว</p>
          
          {latestTotal > 0 && (
            <div style={{ padding: '24px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '16px', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706', marginBottom: '8px' }}>คะแนนล่าสุดของคุณ</h2>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#d97706' }}>
                {latestScore} <span style={{ fontSize: '1.2rem', opacity: 0.8, fontWeight: 600 }}>/ {latestTotal}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => {
              setAlreadyCompleted(false);
              setCurrentStep(0);
              setUserAnswers([]);
              setSelectedAnswer(null);
              setScore(0);
              setCompleted(false);
            }} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 700 }}>
              ทำแบบทดสอบอีกครั้ง
            </button>
            <button onClick={closeLiff} className="btn-primary" style={{ background: 'var(--text-main)', width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 700 }}>
              ปิดหน้าต่างนี้
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', width: '100%', maxWidth: '400px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--success)' }}>
            <Sparkles size={40} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>ทำภารกิจสำเร็จ!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>คุณได้ตอบคำถามใน {checkpointName} <br/> ครบถ้วนและบันทึกข้อมูลเรียบร้อยแล้ว!</p>
          
          <div style={{ padding: '24px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '16px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>สรุปคะแนนของคุณ</h2>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>
              {score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {questions.length}</span>
            </div>
          </div>

          <button onClick={closeLiff} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 700 }}>
            ปิดหน้าต่างนี้
          </button>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: '24px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
            ไปดูตู้สะสมถ้วยรางวัล
          </button>
        </div>
      </main>
    );
  }


  const currentQuestion = questions[currentStep];
  const isAnswered = selectedAnswer !== null;

  if (loadingQuestions) {
    return (
      <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', width: '100%', maxWidth: '400px' }}>
          <h2>ยังไม่มีคำถาม</h2>
          <p>แอดมินยังไม่ได้เพิ่มคำถามในฐานนี้</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ marginTop: '24px' }}>กลับหน้าแรก</button>
        </div>
      </main>
    );
  }

  const getOptionStyle = (optionValue: string) => {
    if (!isAnswered) return {};
    const isCorrectAnswer = currentQuestion.correctAnswer === optionValue;
    const isSelected = selectedAnswer === optionValue;

    if (isCorrectAnswer) {
      return { borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    }
    if (isSelected && !isCorrectAnswer) {
      return { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
    }
    return { opacity: 0.5 };
  };

  const getOptionIcon = (optionValue: string, defaultIcon: React.ReactNode) => {
    if (!isAnswered) return defaultIcon;
    const isCorrectAnswer = currentQuestion.correctAnswer === optionValue;
    const isSelected = selectedAnswer === optionValue;

    if (isCorrectAnswer) {
      return <CheckCircle2 size={32} color="#10b981" />;
    }
    if (isSelected && !isCorrectAnswer) {
      return <XCircle size={32} color="#ef4444" />;
    }
    return defaultIcon;
  };

  return (
    <main className="animate-fade-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--primary-gradient)', width: `${((currentStep) / questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <span>{currentStep + 1} / {questions.length}</span>
            <span>{checkpointName}</span>
          </div>
        </div>
      </header>

      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" key={currentStep} style={{ padding: '40px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.4 }}>{currentQuestion.text}</h2>
        </div>

        {currentQuestion.type === 'yesno' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button 
              onClick={() => handleAnswer('true')} 
              disabled={submitting || isAnswered} 
              className="card option-btn" 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px', cursor: isAnswered ? 'default' : 'pointer', border: '2px solid transparent', transition: 'all 0.3s', ...getOptionStyle('true') }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isAnswered ? 'transparent' : 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isAnswered ? 'inherit' : 'var(--primary)' }}>
                {getOptionIcon('true', <CheckCircle2 size={32} />)}
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: isAnswered ? 'inherit' : 'var(--text-main)' }}>ใช่</span>
            </button>
            <button 
              onClick={() => handleAnswer('false')} 
              disabled={submitting || isAnswered} 
              className="card option-btn" 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px', cursor: isAnswered ? 'default' : 'pointer', border: '2px solid transparent', transition: 'all 0.3s', ...getOptionStyle('false') }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isAnswered ? 'transparent' : 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isAnswered ? 'inherit' : '#ef4444' }}>
                {getOptionIcon('false', <XCircle size={32} />)}
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: isAnswered ? 'inherit' : 'var(--text-main)' }}>ไม่ใช่</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestion.options?.map((option, idx) => {
              const optValue = idx.toString();
              const style = getOptionStyle(optValue);
              
              let icon = null;
              if (isAnswered) {
                const isCorrect = currentQuestion.correctAnswer === optValue;
                const isSel = selectedAnswer === optValue;
                if (isCorrect) icon = <CheckCircle2 size={24} color="#10b981" />;
                else if (isSel) icon = <XCircle size={24} color="#ef4444" />;
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(optValue)} 
                  disabled={submitting || isAnswered} 
                  className="card option-btn"
                  style={{ 
                    textAlign: 'left', 
                    padding: '20px', 
                    fontSize: '1.1rem', 
                    fontWeight: 600, 
                    cursor: isAnswered ? 'default' : 'pointer',
                    border: '2px solid transparent',
                    background: 'var(--card-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s',
                    ...style
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isAnswered && style.color ? 'transparent' : 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: isAnswered && style.color ? style.color : 'var(--primary)', flexShrink: 0 }}>
                    {isAnswered && icon ? icon : String.fromCharCode(65 + idx)}
                  </div>
                  <span style={{ flex: 1, color: isAnswered && style.color ? style.color : 'inherit' }}>{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {isAnswered && (
          <div className="animate-fade-in" style={{ marginTop: '16px' }}>
            <button 
              onClick={handleNext} 
              disabled={submitting}
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 700 }}
            >
              {currentStep < questions.length - 1 ? 'ข้อต่อไป' : 'ส่งคำตอบ'}
            </button>
          </div>
        )}
      </section>

      <style jsx>{`
        .option-btn:not(:disabled):hover {
          border-color: var(--primary) !important;
          background: rgba(139, 92, 246, 0.05) !important;
        }
        .option-btn:not(:disabled):active {
          transform: scale(0.98);
        }
      `}</style>

      {submitting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
      )}
    </main>
  );
}
