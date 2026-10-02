/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleUser, CandidateInfo } from '../types';
import { INSTITUTION_INFO } from '../constants';
import { googleSignIn, initAuth, logoutGoogle } from '../utils/auth';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Hash,
  School,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface GoogleSignInGateProps {
  onAuthenticated: (user: GoogleUser, candidateInfo: CandidateInfo) => void;
}

export const GoogleSignInGate: React.FC<GoogleSignInGateProps> = ({ onAuthenticated }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleAccount, setGoogleAccount] = useState<GoogleUser | null>(null);

  // Candidate Academic Details (Roll number and section; NO email input needed as email comes from real Google SSO)
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [sectionInput, setSectionInput] = useState('');

  // Listen to real Google Auth state
  useEffect(() => {
    const unsubscribe = initAuth((firebaseUser) => {
      if (firebaseUser) {
        const user: GoogleUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Candidate',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || undefined,
          verified: true,
          signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setGoogleAccount(user);
        setNameInput(firebaseUser.displayName || '');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleRealGoogleSSO = async () => {
    setAuthError(null);
    setIsSigningIn(true);

    try {
      const authResult = await googleSignIn();
      if (authResult?.user) {
        const firebaseUser = authResult.user;
        const user: GoogleUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Candidate',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || undefined,
          verified: true,
          signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        setGoogleAccount(user);
        setNameInput(firebaseUser.displayName || '');
      }
    } catch (err: any) {
      console.error('SSO Authentication Failed:', err);
      if (err?.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked by browser. Please enable popups for this site to complete Google Sign-In.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completing. Please try again.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setAuthError(err?.message || 'Failed to authenticate with Google Single Sign-On. Please retry.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleBeginExam = () => {
    if (!googleAccount) return;

    if (!rollInput.trim()) {
      setAuthError('Please enter candidate Roll or Registration number to link with your examination paper.');
      return;
    }

    const candidate: CandidateInfo = {
      name: (nameInput.trim() || googleAccount.name).toUpperCase(),
      email: googleAccount.email,
      rollNumber: rollInput.trim().toUpperCase(),
      classSection: sectionInput.trim() || 'Mid Term Section',
      date: new Date().toISOString().split('T')[0],
    };

    onAuthenticated(googleAccount, candidate);
  };

  const handleChangeAccount = async () => {
    try {
      await logoutGoogle();
    } catch {
      // ignore
    }
    setGoogleAccount(null);
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-lg">
        {/* University Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs mb-3">
            <GraduationCap size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>{INSTITUTION_INFO.institution}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            Mid Term Examination
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            B2 First for Schools · Listening · {INSTITUTION_INFO.practiceTest}
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Official Google Single Sign-On (SSO)
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Connected to Google Identity API for secure student authentication.
              </p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {!googleAccount ? (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Real Single Sign-On Enabled</span>
                  <span>
                    No email entry required. Click the button below to sign in directly with your Google account through Google's official Single Sign-On API.
                  </span>
                </div>
              </div>

              {/* Official Google SSO Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRealGoogleSSO}
                  disabled={isSigningIn}
                  className="w-full relative flex items-center justify-center gap-3 px-5 py-3.5 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-zinc-800 dark:text-white border-2 border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Official Google 4-color SVG */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>
                    {isSigningIn ? 'Connecting to Google SSO...' : 'Sign in with Google'}
                  </span>
                </button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                  <Lock size={12} />
                  <span>Single Sign-On Security Protocol</span>
                </div>
                <p>
                  Examination responses are digitally locked to your authenticated Google account. Final results will be automatically transmitted to faculty at <strong className="text-zinc-700 dark:text-zinc-300">{INSTITUTION_INFO.instructorEmail}</strong>.
                </p>
              </div>
            </div>
          ) : (
            /* Authenticated Confirmation & Candidate Details */
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3.5">
                {googleAccount.picture ? (
                  <img
                    src={googleAccount.picture}
                    alt={googleAccount.name}
                    className="w-11 h-11 rounded-full border-2 border-emerald-500 shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                    {googleAccount.name[0] || 'G'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                    <CheckCircle2 size={14} />
                    <span>Real Google SSO Verified</span>
                  </div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    {googleAccount.name}
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-300 font-mono truncate">
                    {googleAccount.email}
                  </div>
                </div>
              </div>

              {/* Academic Examination Form */}
              <div className="space-y-3.5 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 pb-1 border-b border-zinc-200 dark:border-zinc-700">
                  <UserCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Candidate Examination Details</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter your student name"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Hash size={12} className="text-zinc-400" />
                      <span>Roll / Reg No. *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rollInput}
                      onChange={(e) => {
                        setRollInput(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      placeholder="e.g. KHP-CS-0412"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white font-mono transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <School size={12} className="text-zinc-400" />
                      <span>Class / Section</span>
                    </label>
                    <input
                      type="text"
                      value={sectionInput}
                      onChange={(e) => setSectionInput(e.target.value)}
                      placeholder="e.g. BS-CS Sec A"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleChangeAccount}
                  className="px-3.5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Change Account
                </button>

                <button
                  type="button"
                  onClick={handleBeginExam}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <span>Enter Examination Room</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
