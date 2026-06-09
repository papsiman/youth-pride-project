'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLiff } from '@/providers/LiffProvider';
import { User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { profile, isLoggedIn, liff } = useLiff();
  const router = useRouter();
  const [formData, setFormData] = useState({
    realName: '',
    phoneNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/');
    } else if (isLoggedIn && profile) {
      checkStatus();
    }
  }, [isLoggedIn, profile, router]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/user/status?lineUserId=${profile.userId}`);
      const data = await res.json();
      if (data.registered) {
        setAlreadyRegistered(true);
      }
    } catch (error) {
      console.error('Check status error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineUserId: profile.userId,
          displayName: profile.displayName,
          ...formData,
        }),
      });

      if (res.ok) {
        setRegistered(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
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

  if (alreadyRegistered) {
    return (
      <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(236, 72, 153, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            color: '#ec4899'
          }}>
            <User size={40} />
          </div>
          <h1>คุณเคยลงทะเบียนแล้ว</h1>
          <p>คุณได้ทำการลงทะเบียนในระบบเรียบร้อยแล้ว <br/> ขอบคุณที่เข้าร่วมกิจกรรมครับ!</p>
          
          <button onClick={closeLiff} className="btn-primary" style={{ marginTop: '32px' }}>
            ปิดหน้าต่างนี้
          </button>
        </div>
      </main>
    );
  }

  if (registered) {
    return (
      <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            color: 'var(--success)'
          }}>
            <CheckCircle2 size={40} />
          </div>
          <h1>Registration Success!</h1>
          <p>ยินดีด้วย! คุณลงทะเบียนเข้าร่วมโครงการ <br/> KhonKaen Youth&Pride 2026 เรียบร้อยแล้ว</p>
          
          <button onClick={closeLiff} className="btn-primary" style={{ marginTop: '32px' }}>
            Close Window
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="animate-fade-in">
      <div className="card">
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--input-bg)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px',
            color: 'var(--primary)'
          }}>
            <User size={32} />
          </div>
          <h1>Registration</h1>
          <p>Join the KhonKaen Youth&Pride 2026 journey</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">
              <User size={18} /> Real Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.realName}
              onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label">
              <Phone size={18} /> Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="08X-XXX-XXXX"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Registering...' : 'Start Adventure'}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="status-bar" style={{ marginTop: '24px' }}>
          <CheckCircle2 size={18} />
          Connected as {profile?.displayName}
        </div>
      </div>
    </main>
  );
}
