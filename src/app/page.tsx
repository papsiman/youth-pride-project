'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLiff } from '@/providers/LiffProvider';
import { Loader2, Sparkles } from 'lucide-react';

function HomeContent() {
  const { liff, isLoggedIn, profile } = useLiff();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!liff) return;

    if (!isLoggedIn) {
      liff.login();
      return;
    }

    if (isLoggedIn && profile) {
      handleRouting();
    }
  }, [liff, isLoggedIn, profile]);

  const handleRouting = async () => {
    // 1. ตรวจสอบว่ามีระบุหน้ามาใน Query Param ไหม (เช่น ?page=dashboard)
    const targetPage = searchParams.get('page');
    
    if (targetPage) {
      if (targetPage === 'dashboard') {
        router.replace('/dashboard');
        return;
      }
      if (targetPage === 'register') {
        router.replace('/register');
        return;
      }
      if (targetPage.startsWith('quiz')) {
        const id = targetPage.replace('quiz', '');
        router.replace(`/quiz/${id}`);
        return;
      }
    }

    // 2. ถ้าไม่มีระบุหน้า ให้เช็คสถานะการลงทะเบียนตามปกติ
    try {
      const res = await fetch(`/api/user/status?lineUserId=${profile.userId}`);
      const data = await res.json();

      if (data.registered) {
        router.replace('/dashboard');
      } else {
        router.replace('/register');
      }
    } catch (error) {
      console.error('Check status error:', error);
      setLoading(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <h1 style={{ marginBottom: '24px' }}>Youth Pride 2026</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
          <p style={{ color: 'var(--text-muted)' }}>Initializing your experience...</p>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
