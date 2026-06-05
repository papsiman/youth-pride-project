'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Liff } from '@line/liff';

interface LiffContextType {
  liff: Liff | null;
  liffError: string | null;
  isLoggedIn: boolean;
  profile: any | null;
  logout: () => void;
  login: () => void;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  liffError: null,
  isLoggedIn: false,
  profile: null,
  logout: () => {},
  login: () => {},
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    import('@line/liff')
      .then((liff) => liff.default)
      .then((liff) => {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';
        console.log('LIFF init with ID:', liffId);
        
        liff
          .init({ 
            liffId,
            withLoginOnExternalBrowser: false 
          })
          .then(() => {
            console.log('LIFF init success. Context:', liff.getContext());
            setLiffObject(liff);
            
            // ตรวจสอบทั้ง liff.isInClient() และตรวจสอบจาก User Agent / Context
            const isInsideLine = liff.isInClient() || liff.getContext()?.type !== 'none';
            
            if (liff.isLoggedIn() || isInsideLine) {
              setIsLoggedIn(true);
              liff.getProfile().then((p) => setProfile(p)).catch(() => {});
            }
          })
          .catch((err: any) => {
            console.error('LIFF init error', err);
            setLiffError(err.toString());
          });
      });
  }, []);

  const login = () => {
    liffObject?.login();
  };

  const logout = () => {
    liffObject?.logout();
    setIsLoggedIn(false);
    setProfile(null);
  };

  return (
    <LiffContext.Provider
      value={{
        liff: liffObject,
        liffError,
        isLoggedIn,
        profile,
        login,
        logout,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};
