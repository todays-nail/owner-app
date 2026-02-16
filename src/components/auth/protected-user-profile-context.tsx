"use client";

import * as React from "react";

export interface ProtectedUserProfile {
  displayName: string;
  roleLabel: string;
}

const DEFAULT_PROFILE: ProtectedUserProfile = {
  displayName: "사장님",
  roleLabel: "원장"
};

const ProtectedUserProfileContext =
  React.createContext<ProtectedUserProfile>(DEFAULT_PROFILE);

export function ProtectedUserProfileProvider({
  profile,
  children
}: {
  profile: ProtectedUserProfile;
  children: React.ReactNode;
}) {
  return (
    <ProtectedUserProfileContext.Provider value={profile}>
      {children}
    </ProtectedUserProfileContext.Provider>
  );
}

export function useProtectedUserProfile() {
  return React.useContext(ProtectedUserProfileContext);
}
