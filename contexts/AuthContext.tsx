"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { mockUser } from "@/lib/mockData";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // 演示模式：使用模拟用户
      setCurrentUser(mockUser as any);
      setLoading(false);
      return;
    }

    // 正常模式：使用Firebase
    let mounted = true;
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("Auth timeout, setting loading to false");
        setLoading(false);
      }
    }, 3000); // 3秒超时

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (mounted) {
        setCurrentUser(user);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }, (error) => {
      if (mounted) {
        console.error("Auth error:", error);
        setCurrentUser(null);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string) => {
    if (isDemoMode) {
      // 演示模式：直接设置模拟用户
      setCurrentUser(mockUser as any);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 立即设置用户状态
      setCurrentUser(userCredential.user);

      // 创建用户文档
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    if (isDemoMode) {
      // 演示模式：直接设置模拟用户
      setCurrentUser(mockUser as any);
      return;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // 立即设置用户状态
    setCurrentUser(userCredential.user);
  };

  const loginWithGoogle = async () => {
    if (isDemoMode) {
      // 演示模式：直接设置模拟用户
      setCurrentUser(mockUser as any);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 检查用户文档是否存在，不存在则创建
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (isDemoMode) {
      // 演示模式：清除用户和cookie
      setCurrentUser(null);
      document.cookie = "demo-session=; path=/; max-age=0";
      return;
    }

    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      // 演示模式：不做任何事
      return;
    }

    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px'
        }}>
          加载中...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
