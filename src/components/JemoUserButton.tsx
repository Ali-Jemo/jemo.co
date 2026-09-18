"use client";

import { UserButton } from "@clerk/nextjs";

/**
 * Single-dashboard wiring:
 * - Header already links to /dashboard, so no custom link here.
 * - "Manage account" navigates to the dashboard's security tab instead of
 *   opening a second Clerk modal, so there is exactly one account screen:
 *   /dashboard?tab=settings&section=account (embedded <UserProfile />).
 * - "Sign out" is Clerk default; redirect comes from
 *   <ClerkProvider afterSignOutUrl="/">, demo cleanup from AuthProvider.
 */
export default function JemoUserButton() {
  return (
    <UserButton
      userProfileMode="navigation"
      userProfileUrl="/dashboard?tab=settings&section=account"
    />
  );
}
