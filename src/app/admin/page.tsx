'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2, Users, Search } from 'lucide-react';

interface UserData {
  id: string;
  displayName: string | null;
  realName: string | null;
  phoneNumber: string | null;
  createdAt: string;
  _count: {
    progress: number;
  };
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleClearAllData = async () => {
    const confirmed = window.confirm('คำเตือน: คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ใช้งานและผลการเล่นกิจกรรมทั้งหมด?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้!');
    
    if (!confirmed) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/clear-all', {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'ลบข้อมูลทั้งหมดเรียบร้อยแล้ว' });
        fetchUsers();
      } else {
        setStatus({ type: 'error', message: data.error || 'เกิดข้อผิดพลาดในการลบข้อมูล' });
      }
    } catch (err) {
      console.error('Clear data error:', err);
      setStatus({ type: 'error', message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearUser = async (userId: string, name: string) => {
    const confirmed = window.confirm(`คุณต้องการลบข้อมูลของ ${name} ใช่หรือไม่?`);
    if (!confirmed) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/clear-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: `ลบข้อมูลของ ${name} เรียบร้อยแล้ว` });
        fetchUsers();
      } else {
        setStatus({ type: 'error', message: data.error || 'เกิดข้อผิดพลาดในการลบข้อมูล' });
      }
    } catch (err) {
      console.error('Clear user error:', err);
      setStatus({ type: 'error', message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchRealName = user.realName?.toLowerCase().includes(query);
    const matchDisplayName = user.displayName?.toLowerCase().includes(query);
    const matchPhone = user.phoneNumber?.includes(query);
    return matchRealName || matchDisplayName || matchPhone;
  });

  return (
    <main className="animate-fade-in" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>จัดการระบบ (Admin)</h1>
          <p style={{ color: 'var(--text-muted)' }}>รีเซ็ตข้อมูลทั้งหมด หรือลบเป็นรายบุคคล</p>
        </div>
        <button 
          onClick={() => router.push('/')}
          style={{
            background: 'var(--input-bg)',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 16px'
          }}
        >
          กลับหน้าหลัก
        </button>
      </header>

      {status && (
        <div style={{ 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '24px', 
          background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: status.type === 'success' ? '#10b981' : '#ef4444',
          fontWeight: 600
        }}>
          {status.message}
        </div>
      )}

      <div className="card" style={{ padding: '32px', marginBottom: '32px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444' }}>ลบข้อมูลทั้งหมดในระบบ (Danger Zone)</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ลบผู้ใช้งานทั้งหมด ประวัติการเล่น และคะแนน</p>
          </div>
        </div>
        <button 
          onClick={handleClearAllData} 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
          ลบข้อมูลทั้งหมด
        </button>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>รายชื่อผู้ใช้งาน ({filteredUsers.length} คน)</h2>
          </div>
          
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, LINE หรือเบอร์โทร..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>
        </div>

        {fetchingUsers ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            ไม่พบข้อมูลผู้ใช้งาน
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--input-bg)' }}>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>ชื่อ - นามสกุล</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>เบอร์โทร</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>ผ่านฐาน</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--input-bg)' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{user.realName || '-'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LINE: {user.displayName || '-'}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>{user.phoneNumber || '-'}</td>
                    <td style={{ padding: '12px 8px' }}>{user._count.progress} ฐาน</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleClearUser(user.id, user.realName || user.displayName || 'ผู้ใช้นี้')}
                        disabled={loading}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: loading ? 0.7 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
