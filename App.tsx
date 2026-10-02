/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ViewTab, TestMode, UserAnswers, PartNumber, CandidateInfo, SubmissionRecord, GoogleUser } from './types';
import { QUESTIONS_DATA, INSTITUTION_INFO, FULL_EXAM_PARTS, CAMBRIDGE_SCALE_30 } from './constants';
import { audioEngine, PlaybackStatus, SpeechLine } from './utils/audioEngine';
import { Header } from './components/Header';
import { ExamAudioBar } from './components/ExamAudioBar';
import { QuestionCard } from './components/QuestionCard';
import { AnswerSheetView } from './components/AnswerSheetView';
import { ResultsView } from './components/ResultsView';
import { GoogleSignInGate } from './components/GoogleSignInGate';
import { logoutGoogle } from './utils/auth';
import {
  Lock,
  Unlock,
  Send,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  LogOut,
  Check,
} from 'lucide-react';

const App: React.FC = () => {
  // 1. Google Authentication State (Gate before accessing test; no hardcoded email)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('siba_midterm_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Candidate Information starts empty (populated via dynamic SSO)
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>(() => {
    try {
      const saved = localStorage.getItem('siba_midterm_candidate_info');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: '',
      rollNumber: '',
      classSection: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
    };
  });

  // Navigation & Mode
  const [currentTab, setCurrentTab] = useState<ViewTab>('test');
  const [testMode] = useState<TestMode>('exam'); // Strict Mid Term Exam
  const [selectedPartFilter, setSelectedPartFilter] = useState<PartNumber | 'all'>(1);
  const [maxUnlockedPart, setMaxUnlockedPart] = useState<PartNumber>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User Responses & State
  const [answers, setAnswers] = useState<UserAnswers>(() => {
    try {
      const saved = localStorage.getItem('siba_midterm_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Per-part submissions (lock choices after each part submission)
  const [submittedParts, setSubmittedParts] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('siba_midterm_submitted_parts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('siba_midterm_submitted') === 'true';
    } catch {
      return false;
    }
  });
  const [submissionRecord, setSubmissionRecord] = useState<SubmissionRecord | null>(() => {
    try {
      const saved = localStorage.getItem('siba_midterm_record');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [partToSubmitModal, setPartToSubmitModal] = useState<PartNumber | null>(null);

  // Audio Playback State (Single play track, no replay, status bar tracking)
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [activeLine, setActiveLine] = useState<SpeechLine | null>(null);
  const [activeAudioQuestionId, setActiveAudioQuestionId] = useState<number | null>(null);
  const [activeAudioPart, setActiveAudioPart] = useState<PartNumber | null>(null);
  const [activeAudioTrackKey, setActiveAudioTrackKey] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  // Track audio extracts that have played (cannot be replayed)
  const [playedAudioTracks, setPlayedAudioTracks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('siba_midterm_played_audio');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Sync answers with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('siba_midterm_answers', JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  // Sync submitted parts with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('siba_midterm_submitted_parts', JSON.stringify(submittedParts));
    } catch {
      // ignore
    }
  }, [submittedParts]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Audio engine listeners
  useEffect(() => {
    audioEngine.onStatusChange = (status) => setPlaybackStatus(status);
    audioEngine.onLineChange = (line) => setActiveLine(line);
    audioEngine.onStepChange = (step) => setCurrentStep(step);
    audioEngine.onQuestionChange = (qId) => {
      setActiveAudioQuestionId(qId);
      const idx = QUESTIONS_DATA.findIndex((q) => q.id === qId);
      if (idx !== -1) setActiveQuestionIndex(idx);
    };
    audioEngine.onPartChange = (p) => setActiveAudioPart(p);
    audioEngine.onProgressChange = (pct, currentLine, totalLines, trackKey) => {
      setAudioProgress(pct);
      setActiveAudioTrackKey(trackKey);
    };
    audioEngine.onTrackFinished = (trackKey) => {
      setPlayedAudioTracks((prev) => {
        const next = new Set(prev);
        next.add(trackKey);
        try {
          localStorage.setItem('siba_midterm_played_audio', JSON.stringify(Array.from(next)));
        } catch {
          // ignore
        }
        return next;
      });
      setActiveAudioTrackKey(null);
      setAudioProgress(100);
    };
    audioEngine.onComplete = () => {
      setPlaybackStatus('idle');
      setActiveLine(null);
      setCurrentStep('');
      setActiveAudioPart(null);
      setActiveAudioTrackKey(null);
    };

    return () => {
      audioEngine.stop();
    };
  }, []);

  // Handle Authentication from Google Sign-In Gate
  const handleAuthenticated = (user: GoogleUser, candidate: CandidateInfo) => {
    setGoogleUser(user);
    setCandidateInfo(candidate);
    try {
      localStorage.setItem('siba_midterm_google_user', JSON.stringify(user));
      localStorage.setItem('siba_midterm_candidate_info', JSON.stringify(candidate));
    } catch {
      // ignore
    }
  };

  const handleSignOutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmSignOut = (resetSession = false) => {
    audioEngine.stop();
    logoutGoogle().catch(() => {});
    setGoogleUser(null);
    try {
      localStorage.removeItem('siba_midterm_google_user');
    } catch {
      // ignore
    }

    if (resetSession) {
      setAnswers({});
      setSubmittedParts([]);
      setIsSubmitted(false);
      setSubmissionRecord(null);
      setMaxUnlockedPart(1);
      setSelectedPartFilter(1);
      setPlayedAudioTracks(new Set());
      try {
        localStorage.removeItem('siba_midterm_answers');
        localStorage.removeItem('siba_midterm_submitted_parts');
        localStorage.removeItem('siba_midterm_submitted');
        localStorage.removeItem('siba_midterm_record');
        localStorage.removeItem('siba_midterm_candidate_info');
        localStorage.removeItem('siba_midterm_played_audio');
      } catch {
        // ignore
      }
    }

    setShowLogoutModal(false);
    setCurrentTab('test');
  };

  // Answer handler - STRICTLY BLOCKED when overall exam is submitted OR this part is submitted
  const handleSelectAnswer = (questionId: number, answer: string) => {
    if (isSubmitted) return; // Overall exam finalized
    const targetQ = QUESTIONS_DATA.find((q) => q.id === questionId);
    if (targetQ && submittedParts.includes(targetQ.part)) return; // Part choice locked!

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Audio handlers - Strict single-track, plays 1x only, no replay
  const handlePlayFullExam = () => {
    if (playedAudioTracks.has('full-exam')) return;
    setActiveAudioTrackKey('full-exam');
    setAudioProgress(0);
    audioEngine.playFullExam();
  };

  const handlePlayPart = (part: PartNumber) => {
    if (part > maxUnlockedPart) return; // Locked
    const trackKey = `part-${part}`;
    if (playedAudioTracks.has(trackKey)) return; // No replay

    setActiveAudioPart(part);
    setActiveAudioTrackKey(trackKey);
    setAudioProgress(0);
    audioEngine.playPart(part);
  };

  const handlePlayCurrentQuestion = (questionId?: number) => {
    const targetId = questionId || QUESTIONS_DATA[activeQuestionIndex]?.id;
    if (!targetId) return;
    const targetQ = QUESTIONS_DATA.find((q) => q.id === targetId);
    if (!targetQ) return;
    if (targetQ.part > maxUnlockedPart) return; // Locked

    const trackKey = `q-${targetId}`;
    if (playedAudioTracks.has(trackKey)) return; // No replay

    setActiveAudioQuestionId(targetId);
    setActiveAudioPart(targetQ.part);
    setActiveAudioTrackKey(trackKey);
    setAudioProgress(0);

    if (targetQ.part === 1 && targetQ.audioScript && targetQ.dialogue) {
      audioEngine.playSequence(
        `Question ${targetQ.id}`,
        targetQ.audioScript.intro,
        targetQ.dialogue,
        { questionId: targetQ.id, part: targetQ.part, trackKey }
      );
    } else {
      audioEngine.playPart(targetQ.part);
    }
  };

  const handlePauseResume = () => {
    if (playbackStatus === 'playing') {
      audioEngine.pause();
    } else if (playbackStatus === 'paused') {
      audioEngine.resume();
    }
  };

  const handleStopAudio = () => {
    audioEngine.stop();
  };

  const handleTestChime = () => {
    audioEngine.playCambridgeChime();
  };

  // Completion calculation for sequential unlocks & part submissions
  const part1AnsweredCount = QUESTIONS_DATA.filter(
    (q) => q.part === 1 && !!answers[q.id]?.trim()
  ).length;
  const part2AnsweredCount = QUESTIONS_DATA.filter(
    (q) => q.part === 2 && !!answers[q.id]?.trim()
  ).length;
  const part3AnsweredCount = QUESTIONS_DATA.filter(
    (q) => q.part === 3 && !!answers[q.id]?.trim()
  ).length;
  const part4AnsweredCount = QUESTIONS_DATA.filter(
    (q) => q.part === 4 && !!answers[q.id]?.trim()
  ).length;

  const isPart1Complete = part1AnsweredCount === 8;
  const isPart2Complete = part2AnsweredCount === 10;
  const isPart3Complete = part3AnsweredCount === 5;
  const isPart4Complete = part4AnsweredCount === 7;

  // Auto-manage maxUnlockedPart based on submitted parts
  useEffect(() => {
    if (submittedParts.includes(1) && maxUnlockedPart < 2) setMaxUnlockedPart(2);
    if (submittedParts.includes(2) && maxUnlockedPart < 3) setMaxUnlockedPart(3);
    if (submittedParts.includes(3) && maxUnlockedPart < 4) setMaxUnlockedPart(4);
  }, [submittedParts, maxUnlockedPart]);

  // Open part submit modal
  const handleOpenSubmitPart = (part: PartNumber) => {
    if (part === 4) {
      setShowSubmitConfirmModal(true);
    } else {
      setPartToSubmitModal(part);
    }
  };

  // Confirm per-part submission -> permanently locks answers for that part and unlocks next part
  const handleConfirmSubmitPart = (part: PartNumber) => {
    const updated = Array.from(new Set([...submittedParts, part]));
    setSubmittedParts(updated);

    const nextPart = (part + 1) as PartNumber;
    if (nextPart <= 4) {
      setMaxUnlockedPart(nextPart);
      setSelectedPartFilter(nextPart);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setPartToSubmitModal(null);
  };

  // Evaluation calculation
  const checkCorrect = (q: (typeof QUESTIONS_DATA)[0]) => {
    const user = answers[q.id];
    if (!user || !user.trim()) return false;
    const cleanUser = user.trim().toLowerCase();
    if (q.type === 'sentence-completion' && q.acceptedAnswers) {
      return q.acceptedAnswers.some(
        (ans) => ans.toLowerCase() === cleanUser || cleanUser.includes(ans.toLowerCase())
      );
    }
    return cleanUser === q.correctAnswer.trim().toLowerCase();
  };

  let rawScore = 0;
  const partScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  QUESTIONS_DATA.forEach((q) => {
    if (checkCorrect(q)) {
      rawScore += 1;
      partScores[q.part] += 1;
    }
  });

  const percentage = Math.round((rawScore / QUESTIONS_DATA.length) * 100);
  const scaleInfo =
    CAMBRIDGE_SCALE_30.find((s) => rawScore >= s.minScore && rawScore <= s.maxScore) ||
    CAMBRIDGE_SCALE_30[CAMBRIDGE_SCALE_30.length - 1];

  // Final submission and email dispatch
  const handleFinalSubmit = () => {
    const subId = `SIBA-KHP-MT-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: SubmissionRecord = {
      submissionId: subId,
      submittedAt: new Date().toLocaleString(),
      candidate: candidateInfo,
      score: rawScore,
      totalMarks: 30,
      percentage,
      grade: scaleInfo.grade,
      scaleScore: scaleInfo.scaleScore,
      cefr: scaleInfo.cefr,
      partScores,
      answers,
      emailSentTo: INSTITUTION_INFO.instructorEmail,
      submittedParts: [1, 2, 3, 4],
    };

    setSubmissionRecord(record);
    setIsSubmitted(true);
    setSubmittedParts([1, 2, 3, 4]);
    setShowSubmitConfirmModal(false);
    setCurrentTab('results');
    audioEngine.stop();

    try {
      localStorage.setItem('siba_midterm_submitted', 'true');
      localStorage.setItem('siba_midterm_submitted_parts', JSON.stringify([1, 2, 3, 4]));
      localStorage.setItem('siba_midterm_record', JSON.stringify(record));
    } catch {
      // ignore
    }

    // Automatically trigger official mailto link to instructor
    const emailSubject = encodeURIComponent(
      `[Mid Term Exam Submission] B2 First Listening - ${candidateInfo.name || googleUser?.name} (${candidateInfo.rollNumber}) - Score: ${rawScore}/30`
    );
    const emailBody = encodeURIComponent(
      `SUKKUR IBA UNIVERSITY - KHAIRPUR CAMPUS\nINSTITUTE OF EMERGING TECHNOLOGIES\n` +
      `B2 First for Schools: Listening Mid Term Examination\nCourse: Think 2 (Chapters 1-4)\n\n` +
      `CANDIDATE DETAILS:\nCandidate Name: ${candidateInfo.name || googleUser?.name}\nRoll / Reg No: ${candidateInfo.rollNumber}\n` +
      `Class / Section: ${candidateInfo.classSection}\nGoogle Account: ${googleUser?.email || candidateInfo.email}\nDate: ${candidateInfo.date}\n` +
      `Submission ID: ${subId}\n\n` +
      `OFFICIAL SCORE: ${rawScore} / 30 marks (${percentage}%)\n` +
      `Cambridge Scale: ${scaleInfo.scaleScore} | Grade: ${scaleInfo.grade} | CEFR: ${scaleInfo.cefr}\n\n` +
      `Part 1: ${partScores[1]}/8 | Part 2: ${partScores[2]}/10 | Part 3: ${partScores[3]}/5 | Part 4: ${partScores[4]}/7\n\n` +
      `ITEM RESPONSES (1 to 30):\n` +
      QUESTIONS_DATA.map(
        (q) => `Q${q.id < 10 ? '0' + q.id : q.id} [Part ${q.part}]: ${answers[q.id] || '(No Answer)'} (Key: ${q.correctAnswer})`
      ).join('\n') +
      `\n\nOfficial Submission verified.`
    );

    // Open mail client
    window.location.href = `mailto:${INSTITUTION_INFO.instructorEmail}?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleReviewQuestion = (questionId: number) => {
    const targetQ = QUESTIONS_DATA.find((q) => q.id === questionId);
    if (targetQ) setSelectedPartFilter(targetQ.part);
    const idx = QUESTIONS_DATA.findIndex((item) => item.id === questionId);
    if (idx !== -1) setActiveQuestionIndex(idx);
    setCurrentTab('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredTotalCount = Object.values(answers).filter((a) => a && a.trim() !== '').length;

  // Filtered questions based on selected Part
  const displayedQuestions = useMemo(() => {
    if (selectedPartFilter === 'all') {
      return QUESTIONS_DATA.filter((q) => q.part <= maxUnlockedPart);
    }
    return QUESTIONS_DATA.filter((q) => q.part === selectedPartFilter);
  }, [selectedPartFilter, maxUnlockedPart]);

  const usedMatchingLetters = useMemo(() => {
    const set = new Set<string>();
    QUESTIONS_DATA.filter((q) => q.part === 3).forEach((q) => {
      const val = answers[q.id];
      if (val && val.trim()) set.add(val.trim().toUpperCase());
    });
    return set;
  }, [answers]);

  // Tab switching guard: Results only allowed if submitted
  const handleTabChange = (tab: ViewTab) => {
    if (tab === 'results' && !isSubmitted) {
      setCurrentTab('test');
      return;
    }
    setCurrentTab(tab);
  };

  // If candidate is not authenticated with Google, show the Google Sign-In Gate FIRST!
  if (!googleUser) {
    return <GoogleSignInGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 font-sans flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* 1. Header with Sukkur IBA University branding & Google Account indicator */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        answeredCount={answeredTotalCount}
        totalQuestions={QUESTIONS_DATA.length}
        isSubmitted={isSubmitted}
        googleUser={googleUser}
        onSignOut={handleSignOutClick}
      />

      {/* 2. Exam Audio Control Dock with part locking, single play enforcement, and real-time status bar */}
      <ExamAudioBar
        playbackStatus={playbackStatus}
        currentStep={currentStep}
        activeLine={activeLine}
        activeQuestionId={activeAudioQuestionId}
        activePart={activeAudioPart}
        activeTrackKey={activeAudioTrackKey}
        maxUnlockedPart={maxUnlockedPart}
        audioProgress={audioProgress}
        playedTracks={playedAudioTracks}
        onPlayFullExam={handlePlayFullExam}
        onPlayPart={handlePlayPart}
        onPlayCurrentQuestion={() => handlePlayCurrentQuestion()}
        onPauseResume={handlePauseResume}
        onStop={handleStopAudio}
        onTestChime={handleTestChime}
      />

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* TAB 1: Questions Paper */}
        {currentTab === 'test' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Questions List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Institution & Examination Banner */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                    {INSTITUTION_INFO.institution}
                  </div>
                  <h1 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    {INSTITUTION_INFO.component} · {INSTITUTION_INFO.practiceTest}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Faculty: {INSTITUTION_INFO.instructorEmail} · 4 Sequential Parts (30 Marks)
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono">
                    <span className="text-zinc-500 mr-1.5">Total Progress:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400">
                      {answeredTotalCount} / 30
                    </strong>
                  </div>
                </div>
              </div>

              {/* Sequential Part Tabs Bar with Lock & Submitted badges */}
              <div className="flex items-center gap-1.5 p-1 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-xl overflow-x-auto text-xs font-medium">
                {FULL_EXAM_PARTS.map((p) => {
                  const isLocked = p.part > maxUnlockedPart;
                  const isPartLocked = isSubmitted || submittedParts.includes(p.part);
                  const isCurrent = selectedPartFilter === p.part;

                  return (
                    <button
                      key={p.part}
                      onClick={() => setSelectedPartFilter(p.part)}
                      className={`px-3 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs font-semibold'
                          : isLocked
                          ? 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'
                          : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900'
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={12} className="text-amber-500" />
                      ) : isPartLocked ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <Check size={12} className="text-zinc-400" />
                      )}
                      <span>
                        Part {p.part} ({p.questionRange})
                      </span>
                      {isPartLocked && (
                        <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-1 py-0.2 rounded font-mono">
                          Locked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Locked Gate View if user views a locked part */}
              {selectedPartFilter !== 'all' && selectedPartFilter > maxUnlockedPart ? (
                <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-amber-300 dark:border-amber-800/60 rounded-2xl p-8 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 mx-auto mb-3">
                    <Lock size={24} />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white mb-2">
                    Part {selectedPartFilter} is Locked
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                    In this Mid Term Examination, sequential part submission is enforced. You must complete and submit all questions in Part{' '}
                    {selectedPartFilter - 1} before Part {selectedPartFilter} unlocks.
                  </p>
                  <button
                    onClick={() => setSelectedPartFilter((selectedPartFilter - 1) as PartNumber)}
                    className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Go Back to Part {selectedPartFilter - 1}
                  </button>
                </div>
              ) : (
                /* Unlocked Questions List */
                <div className="space-y-6">
                  {/* Part Description Header */}
                  {selectedPartFilter !== 'all' && (
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-0.5">
                            {FULL_EXAM_PARTS.find((p) => p.part === selectedPartFilter)?.title}
                          </h3>
                          {submittedParts.includes(selectedPartFilter) && (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-semibold text-[10px]">
                              Part Submitted & Locked
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          {FULL_EXAM_PARTS.find((p) => p.part === selectedPartFilter)?.description}
                        </p>
                      </div>

                      <div className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                        {selectedPartFilter === 1 && `${part1AnsweredCount} / 8 Answered`}
                        {selectedPartFilter === 2 && `${part2AnsweredCount} / 10 Answered`}
                        {selectedPartFilter === 3 && `${part3AnsweredCount} / 5 Answered`}
                        {selectedPartFilter === 4 && `${part4AnsweredCount} / 7 Answered`}
                      </div>
                    </div>
                  )}

                  {displayedQuestions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      selectedAnswer={answers[q.id]}
                      onSelectAnswer={handleSelectAnswer}
                      testMode={testMode}
                      isFlagged={flaggedQuestions.has(q.id)}
                      onToggleFlag={handleToggleFlag}
                      onPlayExtract={(id) => handlePlayCurrentQuestion(id)}
                      isPlayingThis={playbackStatus === 'playing' && (activeAudioQuestionId === q.id || activeAudioTrackKey === `q-${q.id}`)}
                      isSubmitted={isSubmitted}
                      isPartSubmitted={submittedParts.includes(q.part)}
                      hasPlayedAudio={playedAudioTracks.has(`q-${q.id}`)}
                      audioProgress={activeAudioTrackKey === `q-${q.id}` ? audioProgress : 0}
                      usedMatchingLetters={usedMatchingLetters}
                    />
                  ))}

                  {/* ========================================================= */}
                  {/* SUBMISSION BUTTONS AFTER EACH PART (Locks choices) */}
                  {/* ========================================================= */}
                  {selectedPartFilter === 1 && (
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                      <div>
                        <div className="font-semibold text-xs text-zinc-900 dark:text-white mb-0.5">
                          Part 1 Status: {part1AnsweredCount} / 8 Answered
                        </div>
                        <p className="text-xs text-zinc-500">
                          {submittedParts.includes(1)
                            ? 'Part 1 has been submitted and locked. You can now proceed with Part 2.'
                            : isPart1Complete
                            ? 'All 8 questions completed! Submit Part 1 to lock your choices and unlock Part 2.'
                            : 'Answer all 8 questions in Part 1 to enable submission and unlock Part 2.'}
                        </p>
                      </div>

                      {submittedParts.includes(1) ? (
                        <button
                          onClick={() => setSelectedPartFilter(2)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                        >
                          <span>Proceed to Part 2</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmitPart(1)}
                          disabled={!isPart1Complete}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                            isPart1Complete
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          <Lock size={14} />
                          <span>Submit & Lock Part 1</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {selectedPartFilter === 2 && (
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                      <div>
                        <div className="font-semibold text-xs text-zinc-900 dark:text-white mb-0.5">
                          Part 2 Status: {part2AnsweredCount} / 10 Answered
                        </div>
                        <p className="text-xs text-zinc-500">
                          {submittedParts.includes(2)
                            ? 'Part 2 has been submitted and locked. You can now proceed with Part 3.'
                            : isPart2Complete
                            ? 'All 10 questions completed! Submit Part 2 to lock your choices and unlock Part 3.'
                            : 'Answer all 10 questions in Part 2 to enable submission and unlock Part 3.'}
                        </p>
                      </div>

                      {submittedParts.includes(2) ? (
                        <button
                          onClick={() => setSelectedPartFilter(3)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                        >
                          <span>Proceed to Part 3</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmitPart(2)}
                          disabled={!isPart2Complete}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                            isPart2Complete
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          <Lock size={14} />
                          <span>Submit & Lock Part 2</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {selectedPartFilter === 3 && (
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                      <div>
                        <div className="font-semibold text-xs text-zinc-900 dark:text-white mb-0.5">
                          Part 3 Status: {part3AnsweredCount} / 5 Answered
                        </div>
                        <p className="text-xs text-zinc-500">
                          {submittedParts.includes(3)
                            ? 'Part 3 has been submitted and locked. You can now proceed with Part 4.'
                            : isPart3Complete
                            ? 'All 5 questions completed! Submit Part 3 to lock your choices and unlock Part 4.'
                            : 'Answer all 5 questions in Part 3 to enable submission and unlock Part 4.'}
                        </p>
                      </div>

                      {submittedParts.includes(3) ? (
                        <button
                          onClick={() => setSelectedPartFilter(4)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                        >
                          <span>Proceed to Part 4</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmitPart(3)}
                          disabled={!isPart3Complete}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                            isPart3Complete
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          <Lock size={14} />
                          <span>Submit & Lock Part 3</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {selectedPartFilter === 4 && (
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                      <div>
                        <div className="font-semibold text-xs text-zinc-900 dark:text-white mb-0.5">
                          Part 4 Status: {part4AnsweredCount} / 7 Answered · Overall {answeredTotalCount} / 30
                        </div>
                        <p className="text-xs text-zinc-500">
                          {isSubmitted
                            ? 'Examination is finalized and results have been dispatched to instructor.'
                            : answeredTotalCount === 30
                            ? 'All 30 questions completed! Submit Part 4 to finalize your Mid Term Exam and receive official results.'
                            : 'Complete all questions in Part 4 to finalize the Mid Term Exam.'}
                        </p>
                      </div>

                      {!isSubmitted && (
                        <button
                          onClick={() => setShowSubmitConfirmModal(true)}
                          disabled={answeredTotalCount < 30}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                            answeredTotalCount === 30
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          <Send size={14} />
                          <span>Submit & Finalize Mid Term Exam</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: 30-Question Navigator & Candidate Box */}
            <aside className="lg:col-span-4 space-y-6 sticky top-24">
              {/* Question Navigator */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Question Navigator (1–30)
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    {answeredTotalCount} / 30
                  </span>
                </div>

                {/* Sub-groups by Part with Lock & Submitted badges */}
                <div className="space-y-3 mb-4">
                  {[1, 2, 3, 4].map((partNum) => {
                    const isPartLocked = partNum > maxUnlockedPart;
                    const isPartDone = submittedParts.includes(partNum);
                    const partQs = QUESTIONS_DATA.filter((q) => q.part === partNum);

                    return (
                      <div key={partNum}>
                        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            {isPartLocked ? (
                              <Lock size={10} className="text-amber-500" />
                            ) : isPartDone ? (
                              <CheckCircle2 size={10} className="text-emerald-500" />
                            ) : (
                              <Unlock size={10} className="text-indigo-500" />
                            )}
                            <span>Part {partNum}</span>
                            {isPartDone && <span className="text-emerald-600 font-bold">(Locked)</span>}
                          </span>
                          <span>Q{partQs[0].id}–Q{partQs[partQs.length - 1].id}</span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5">
                          {partQs.map((q) => {
                            const isAnswered = !!answers[q.id] && answers[q.id].trim() !== '';
                            const isFlagged = flaggedQuestions.has(q.id);
                            const isCurrentAudio = activeAudioQuestionId === q.id || activeAudioTrackKey === `q-${q.id}`;

                            let btnClass =
                              'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 cursor-pointer';

                            if (isPartLocked) {
                              btnClass =
                                'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed';
                            } else if (isAnswered) {
                              btnClass =
                                'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold border-zinc-900 cursor-pointer';
                            }

                            if (isSubmitted) {
                              const isCorrect = checkCorrect(q);
                              btnClass = isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600 font-bold cursor-pointer'
                                : 'bg-red-600 text-white border-red-600 font-bold cursor-pointer';
                            }

                            return (
                              <button
                                key={q.id}
                                disabled={isPartLocked}
                                onClick={() => {
                                  if (!isPartLocked) {
                                    setSelectedPartFilter(q.part);
                                    const idx = QUESTIONS_DATA.findIndex((item) => item.id === q.id);
                                    if (idx !== -1) setActiveQuestionIndex(idx);
                                  }
                                }}
                                className={`h-8 rounded-lg flex flex-col items-center justify-center relative transition-all text-[11px] font-mono ${btnClass} ${
                                  isCurrentAudio ? 'ring-2 ring-indigo-500' : ''
                                }`}
                              >
                                <span>{q.id}</span>
                                {isFlagged && (
                                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-zinc-900 dark:bg-white inline-block"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span>Part Choice Locked & Submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={12} className="text-amber-500" />
                    <span>Locked until prior part completed</span>
                  </div>
                </div>
              </div>

              {/* Candidate Info Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 text-xs shadow-xs">
                <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5 mb-3">
                  <UserCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Verified Google Candidate</span>
                </h4>
                <div className="space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">CANDIDATE NAME</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {candidateInfo.name || googleUser.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">GOOGLE SSO EMAIL</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                      {googleUser.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">ROLL NO</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {candidateInfo.rollNumber || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">FACULTY SUBMISSION RECIPIENT</span>
                    <span className="text-indigo-600 dark:text-indigo-400 truncate block select-all font-semibold">
                      {INSTITUTION_INFO.instructorEmail}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* TAB 2: Answer Sheet (OMR Format with per-part submission) */}
        {currentTab === 'answer-sheet' && (
          <AnswerSheetView
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onSubmit={() => setShowSubmitConfirmModal(true)}
            onSubmitPart={handleOpenSubmitPart}
            isSubmitted={isSubmitted}
            submittedParts={submittedParts}
            score={rawScore}
            candidateInfo={candidateInfo}
            onUpdateCandidateInfo={setCandidateInfo}
            maxUnlockedPart={maxUnlockedPart}
          />
        )}

        {/* TAB 3: Official Results (Only accessible post-submission) */}
        {currentTab === 'results' && isSubmitted && (
          <ResultsView
            answers={answers}
            candidateInfo={candidateInfo}
            submissionRecord={submissionRecord}
            onReviewQuestion={handleReviewQuestion}
            onSignOut={handleSignOutClick}
          />
        )}
      </main>

      {/* Per-Part Submission Confirmation Modal */}
      {partToSubmitModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-up text-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Submit & Lock Part {partToSubmitModal} Answers?
                </h3>
                <p className="text-zinc-500">
                  {FULL_EXAM_PARTS.find((p) => p.part === partToSubmitModal)?.title}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-900 dark:text-amber-200 mb-5 leading-relaxed space-y-1">
              <span className="font-bold block">Important Locking Policy:</span>
              <p>
                Submitting Part {partToSubmitModal} will <strong>permanently lock all your choices for this part</strong>. You will not be able to change these answers later. Part {partToSubmitModal + 1} will then be unlocked.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setPartToSubmitModal(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Go Back & Review
              </button>

              <button
                onClick={() => handleConfirmSubmitPart(partToSubmitModal)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Lock size={13} />
                <span>Confirm & Lock Part {partToSubmitModal}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submission Confirmation Modal */}
      {showSubmitConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-slide-up text-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Confirm Official Mid Term Submission
                </h3>
                <p className="text-zinc-500">
                  {INSTITUTION_INFO.institution}
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl mb-4 space-y-2">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                Please verify your details before finalizing:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div>
                  <span className="text-zinc-400 block">Candidate:</span>
                  <span className="font-bold">{candidateInfo.name || googleUser.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Roll No:</span>
                  <span className="font-bold">{candidateInfo.rollNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Google Account:</span>
                  <span className="truncate block font-bold">{googleUser.email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Total Answered:</span>
                  <span className="font-bold text-emerald-600">{answeredTotalCount} / 30</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-900 dark:text-amber-200 mb-6 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock size={13} />
                <span>Permanent Response Locking Policy:</span>
              </div>
              <p className="leading-relaxed">
                After submission, your responses are finalized and <strong>cannot be modified</strong>. Your results and detailed question responses will be officially recorded and transmitted to:
              </p>
              <p className="font-mono font-bold select-all text-indigo-700 dark:text-indigo-400">
                {INSTITUTION_INFO.instructorEmail}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Go Back & Review
              </button>

              <button
                onClick={handleFinalSubmit}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Send size={13} />
                <span>Confirm & Send to Instructor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-up text-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
                <LogOut size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Log Out of Examination
                </h3>
                <p className="text-zinc-500 font-mono text-[11px] truncate max-w-[260px]">
                  {googleUser.email}
                </p>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              {isSubmitted
                ? 'You have already finalized and submitted your examination. Logging out will return you to the Google Sign-In page.'
                : 'Logging out will end your current active session and return you to the Google Sign-In page. Your answers entered so far remain saved.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {isSubmitted && (
                <button
                  onClick={() => confirmSignOut(true)}
                  className="w-full sm:w-auto px-3.5 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-semibold transition-colors cursor-pointer text-center"
                  title="Clear previous student responses and return to sign in"
                >
                  Start Fresh Session
                </button>
              )}

              <button
                onClick={() => confirmSignOut(false)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <LogOut size={13} />
                <span>Log Out & Return to Sign In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;