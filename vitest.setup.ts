import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  Show: ({ when, children }: { when: string; children: React.ReactNode }) => {
    return when === 'signed-out' ? children : null
  },
  SignInButton: ({ children }: { children?: React.ReactNode }) => children ?? null,
  SignUpButton: ({ children }: { children?: React.ReactNode }) => children ?? null,
  UserButton: () => null,
  ClerkLoading: ({ children }: { children?: React.ReactNode }) => children ?? null,
  ClerkLoaded: ({ children }: { children?: React.ReactNode }) => children ?? null,
  SignIn: () => React.createElement("div", { "data-testid": "clerk-sign-in" }, "تسجيل الدخول عبر Clerk"),
  SignUp: () => React.createElement("div", { "data-testid": "clerk-sign-up" }, "إنشاء حساب عبر Clerk"),
  useUser: () => ({ isSignedIn: false, user: null, isLoaded: true }),
  useClerk: () => ({ signOut: () => Promise.resolve() }),
  useAuth: () => ({ isSignedIn: false, userId: null, getToken: () => Promise.resolve(null) }),
  currentUser: () => Promise.resolve(null),
  auth: () => Promise.resolve({ userId: null }),
}))