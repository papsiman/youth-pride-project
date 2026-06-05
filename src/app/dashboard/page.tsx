'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiff } from '@/providers/LiffProvider';
import { Trophy, CheckCircle, MapPin, Loader2, Award } from 'lucide-react';

interface Checkpoint {
  checkpointId: number;
  name: string;
  completed: boolean;
  completedAt: string | null;
}

export default function Dashboard() {
  const { profile, isLoggedIn, liff } = useLiff();
  const router = useRouter();
  const [progress, setProgress] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && profile) {
      fetchProgress();
    }
  }, [isLoggedIn, profile]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/user/status?lineUserId=${profile.userId}`);
      const data = await res.json();
      if (data.progress) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Fetch progress error:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeLiff = () => {
    if (liff && liff.isInClient()) {
      liff.closeWindow();
    } else {
      alert("คำสั่งปิดจะทำงานเมื่อเปิดผ่านแอป LINE เท่านั้นครับ");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <main className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1>Achievements</h1>
        <p>Your Pride Journey Progress</p>
      </header>

      {/* Trophy Case Section (Inspired by Image) */}
      <div className="card" style={{ 
        background: '#7c2d12', // Wood color
        padding: '30px 15px 15px', 
        borderRadius: '20px', 
        position: 'relative',
        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.3)',
        marginBottom: '40px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px',
          background: '#431407', // Darker wood/interior
          padding: '20px 10px',
          borderRadius: '12px',
          minHeight: '120px',
          alignItems: 'end'
        }}>
          {[1, 2, 3].map((id) => {
            const isCompleted = progress.find(p => p.checkpointId === id)?.completed;
            return (
              <div key={id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Trophy 
                  size={48} 
                  color={isCompleted ? '#fbbf24' : '#1e293b'} 
                  fill={isCompleted ? '#fbbf24' : 'rgba(30, 41, 59, 0.2)'}
                  style={{ 
                    filter: isCompleted ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' : 'none',
                    transition: 'all 0.5s ease',
                    marginBottom: '8px'
                  }}
                />
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: isCompleted ? '#fef3c7' : '#94a3b8',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  Base {id}
                </span>
              </div>
            );
          })}
        </div>
        {/* Wooden Shelf Edge */}
        <div style={{ 
          height: '12px', 
          background: '#92400e', 
          width: '100%', 
          marginTop: '5px', 
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
            {progress.filter(p => p.completed).length}
          </div>
          <div className="badge">Completed</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-muted)' }}>
            {progress.length}
          </div>
          <div className="badge">Total Stations</div>
        </div>
      </div>

      <button onClick={closeLiff} className="btn-primary" style={{ background: 'var(--text-main)', marginTop: 0 }}>
        Close Dashboard
      </button>

      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        LIFF Status: {liff ? (
          liff.isInClient() ? '✅ In LINE App' : 
          (liff.getContext()?.type !== 'none' ? `⚠️ Context: ${liff.getContext()?.type}` : '🌐 In Browser')
        ) : '⌛ Initializing...'}
      </div>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
        Complete all stations to unlock special rewards!
      </p>
    </main>
  );
}
