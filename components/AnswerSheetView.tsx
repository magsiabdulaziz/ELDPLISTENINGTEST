/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAnswers, CandidateInfo, PartNumber } from '../types';
import { QUESTIONS_DATA, PART_3_MATCHING_OPTIONS, INSTITUTION_INFO } from '../constants';
import { CheckCircle2, Clock, Send, Check, Lock, AlertTriangle, ArrowRight } from 'lucide-react';

interface AnswerSheetViewProps {
  answers: UserAnswers;
  onSelectAnswer: (questionId: number, answer: string) => void;
  onSubmit: () => void;
  onSubmitPart: (part: PartNumber) => void;
  isSubmitted: boolean;
  submittedParts: number[];
  score?: number;
  candidateInfo: CandidateInfo;
  onUpdateCandidateInfo: (info: CandidateInfo) => void;
  maxUnlockedPart: PartNumber;
}

export const AnswerSheetView: React.FC<AnswerSheetViewProps> = ({
  answers,
  onSelectAnswer,
  onSubmit,
  onSubmitPart,
  isSubmitted,
  submittedParts,
  score,
  candidateInfo,
  onUpdateCandidateInfo,
  maxUnlockedPart,
}) => {
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.values(answers).filter((a) => a && a.trim() !== '').length;

  const part1Answered = QUESTIONS_DATA.filter((q) => q.part === 1 && !!answers[q.id]?.trim()).length;
  const part2Answered = QUESTIONS_DATA.filter((q) => q.part === 2 && !!answers[q.id]?.trim()).length;
  const part3Answered = QUESTIONS_DATA.filter((q) => q.part === 3 && !!answers[q.id]?.trim()).length;
  const part4Answered = QUESTIONS_DATA.filter((q) => q.part === 4 && !!answers[q.id]?.trim()).length;

  const isPart1Locked = isSubmitted || submittedParts.includes(1);
  const isPart2Locked = isSubmitted || submittedParts.includes(2);
  const isPart3Locked = isSubmitted || submittedParts.includes(3);
  const isPart4Locked = isSubmitted || submittedParts.includes(4);

  const checkPart2Correct = (q: (typeof QUESTIONS_DATA)[0], val: string) => {
    if (!val || !val.trim()) return false;
    const clean = val.trim().toLowerCase();
    if (q.acceptedAnswers) {
      return q.acceptedAnswers.some((a) => a.toLowerCase() === clean || clean.includes(a.toLowerCase()));
    }
    return clean === q.correctAnswer.toLowerCase();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in">
      {/* Submitted locked alert */}
      {isSubmitted && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-emerald-600" />
            <span className="font-semibold">
              Official Examination Finalized & Submitted. All 30 responses are permanently locked and cannot be edited.
            </span>
          </div>
          <span className="font-mono font-bold text-sm">Score: {score} / 30</span>
        </div>
      )}

      {/* Instructions banner */}
      <div className="mb-6 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
        <div>
          <strong className="block text-sm mb-0.5 font-semibold">
            {INSTITUTION_INFO.institution}
          </strong>
          <span>
            {INSTITUTION_INFO.component} · {INSTITUTION_INFO.practiceTest} · Candidate Answer Sheet (30 Marks). Use pencil to shade the lozenges.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 font-mono px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-amber-300 dark:border-amber-800 text-zinc-900 dark:text-zinc-100 font-bold">
            <Clock size={14} className="text-amber-600" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-2.5 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors cursor-pointer"
            >
              {isTimerRunning ? 'Pause' : 'Start 5m Timer'}
            </button>
          )}
        </div>
      </div>

      {/* Answer Sheet Paper Card */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6 sm:p-8 shadow-md">
        {/* Candidate Table matching Page 1 of PDF */}
        <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="block text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider">
              Candidate Name *
            </span>
            <input
              type="text"
              disabled={isSubmitted}
              value={candidateInfo.name}
              onChange={(e) =>
                !isSubmitted && onUpdateCandidateInfo({ ...candidateInfo, name: e.target.value.toUpperCase() })
              }
              placeholder="FULL NAME"
              className={`w-full bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded border font-bold uppercase transition-colors ${
                isSubmitted
                  ? 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-not-allowed'
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white'
              }`}
            />
          </div>

          <div>
            <span className="block text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider">
              Candidate / Roll No. *
            </span>
            <input
              type="text"
              disabled={isSubmitted}
              value={candidateInfo.rollNumber}
              onChange={(e) =>
                !isSubmitted && onUpdateCandidateInfo({ ...candidateInfo, rollNumber: e.target.value.toUpperCase() })
              }
              placeholder="KHP-CS-0412"
              className={`w-full bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded border font-bold transition-colors ${
                isSubmitted
                  ? 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-not-allowed'
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white'
              }`}
            />
          </div>

          <div>
            <span className="block text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider">
              Class / Section *
            </span>
            <input
              type="text"
              disabled={isSubmitted}
              value={candidateInfo.classSection}
              onChange={(e) =>
                !isSubmitted && onUpdateCandidateInfo({ ...candidateInfo, classSection: e.target.value })
              }
              placeholder="BS-CS Section A"
              className={`w-full bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded border font-bold transition-colors ${
                isSubmitted
                  ? 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-not-allowed'
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white'
              }`}
            />
          </div>

          <div>
            <span className="block text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider">
              Student Google Email *
            </span>
            <input
              type="email"
              disabled={isSubmitted}
              value={candidateInfo.email}
              onChange={(e) =>
                !isSubmitted && onUpdateCandidateInfo({ ...candidateInfo, email: e.target.value })
              }
              placeholder="student@gmail.com"
              className={`w-full bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded border font-bold transition-colors ${
                isSubmitted
                  ? 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-not-allowed'
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white'
              }`}
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 1 GRID (Questions 1 - 8) */}
        {/* ======================================================== */}
        <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-850/40">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Part 1 (Questions 1 – 8) · Multiple Choice</span>
              {isPart1Locked && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <Lock size={10} /> Locked & Submitted
                </span>
              )}
            </h3>
            <span className="text-[11px] text-zinc-400">Shade ONE lozenge [A] [B] [C]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {QUESTIONS_DATA.filter((q) => q.part === 1).map((q) => {
              const currentAnswer = answers[q.id];

              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {q.id}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
                      {q.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['A', 'B', 'C'] as const).map((letter) => {
                      const isSelected = currentAnswer === letter;
                      let bubble =
                        'bg-white dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300';

                      if (isSelected) {
                        bubble =
                          'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 font-bold';
                      }

                      if (isSubmitted) {
                        if (letter === q.correctAnswer) {
                          bubble = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                        } else if (isSelected && letter !== q.correctAnswer) {
                          bubble = 'bg-red-600 border-red-600 text-white font-bold line-through';
                        }
                      }

                      return (
                        <button
                          key={letter}
                          disabled={isPart1Locked}
                          onClick={() => !isPart1Locked && onSelectAnswer(q.id, letter)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono omr-bubble transition-all ${bubble} ${
                            isPart1Locked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                          }`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission button for Part 1 */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs text-zinc-500 font-mono">
              Part 1: {part1Answered} / 8 Answered
            </span>

            {!isPart1Locked && (
              <button
                onClick={() => onSubmitPart(1)}
                disabled={part1Answered < 8}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  part1Answered === 8
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                }`}
              >
                <Lock size={12} />
                <span>Submit & Lock Part 1</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2 GRID (Questions 9 - 18: Sentence Completion) */}
        {/* ======================================================== */}
        <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-850/40 relative">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Part 2 (Questions 9 – 18) · Sentence Completion</span>
              {isPart2Locked && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <Lock size={10} /> Locked & Submitted
                </span>
              )}
              {maxUnlockedPart < 2 && !isPart2Locked && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px] font-normal">
                  <Lock size={12} /> Locked until Part 1 completed
                </span>
              )}
            </h3>
            <span className="text-[11px] text-zinc-400">Write words in capital letters</span>
          </div>

          {maxUnlockedPart < 2 ? (
            <div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center text-xs text-zinc-500">
              <Lock size={20} className="mx-auto text-zinc-400 mb-2" />
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                Part 2 is locked on the Answer Sheet.
              </p>
              <p className="mt-1">
                Complete and submit Part 1 to unlock Sentence Completion (Questions 9–18).
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                {QUESTIONS_DATA.filter((q) => q.part === 2).map((q) => {
                  const currentVal = answers[q.id] || '';
                  const isCorrect = checkPart2Correct(q, currentVal);

                  return (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-2"
                    >
                      <span className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                        {q.id}
                      </span>

                      <input
                        type="text"
                        disabled={isPart2Locked}
                        value={currentVal}
                        onChange={(e) =>
                          !isPart2Locked && onSelectAnswer(q.id, e.target.value.toUpperCase())
                        }
                        placeholder={isPart2Locked ? '(locked)' : 'word(s)...'}
                        className={`flex-1 font-mono uppercase px-2.5 py-1 text-xs rounded border transition-colors ${
                          isPart2Locked ? 'cursor-not-allowed opacity-90' : ''
                        } ${
                          isSubmitted
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                            : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        }`}
                      />

                      {isSubmitted && (
                        <span className="text-[11px] font-mono shrink-0">
                          {isCorrect ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <span className="text-red-600 font-semibold underline">[{q.correctAnswer}]</span>
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submission button for Part 2 */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 font-mono">
                  Part 2: {part2Answered} / 10 Answered
                </span>

                {!isPart2Locked && (
                  <button
                    onClick={() => onSubmitPart(2)}
                    disabled={part2Answered < 10}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      part2Answered === 10
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs'
                        : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Lock size={12} />
                    <span>Submit & Lock Part 2</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* ======================================================== */}
        {/* PART 3 GRID (Questions 19 - 23: Multiple Matching) */}
        {/* ======================================================== */}
        <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-850/40 relative">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Part 3 (Questions 19 – 23) · Multiple Matching</span>
              {isPart3Locked && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <Lock size={10} /> Locked & Submitted
                </span>
              )}
              {maxUnlockedPart < 3 && !isPart3Locked && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px] font-normal">
                  <Lock size={12} /> Locked until Part 2 completed
                </span>
              )}
            </h3>
            <span className="text-[11px] text-zinc-400">Match Speaker 1–5 to letters A–H</span>
          </div>

          {maxUnlockedPart < 3 ? (
            <div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center text-xs text-zinc-500">
              <Lock size={20} className="mx-auto text-zinc-400 mb-2" />
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                Part 3 is locked on the Answer Sheet.
              </p>
              <p className="mt-1">
                Complete and submit Part 2 to unlock Multiple Matching (Questions 19–23).
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs mb-3">
                {QUESTIONS_DATA.filter((q) => q.part === 3).map((q) => {
                  const currentVal = answers[q.id] || '';
                  const isCorrect = currentVal === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center text-center"
                    >
                      <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                        Speaker {q.speakerNumber}
                      </div>
                      <span className="text-[10px] text-zinc-400 mb-2">Q{q.id}</span>

                      <select
                        disabled={isPart3Locked}
                        value={currentVal}
                        onChange={(e) => !isPart3Locked && onSelectAnswer(q.id, e.target.value)}
                        className={`font-mono font-bold text-sm px-2 py-1 rounded border ${
                          isPart3Locked ? 'cursor-not-allowed opacity-90' : ''
                        } ${
                          isSubmitted
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-red-400 bg-red-50 text-red-900'
                            : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        <option value="">—</option>
                        {PART_3_MATCHING_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            [{opt.key}] {opt.text.substring(0, 30)}...
                          </option>
                        ))}
                      </select>

                      {isSubmitted && !isCorrect && (
                        <span className="text-[11px] text-red-600 mt-1 font-mono font-bold">
                          Key: {q.correctAnswer}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submission button for Part 3 */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 font-mono">
                  Part 3: {part3Answered} / 5 Answered
                </span>

                {!isPart3Locked && (
                  <button
                    onClick={() => onSubmitPart(3)}
                    disabled={part3Answered < 5}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      part3Answered === 5
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs'
                        : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Lock size={12} />
                    <span>Submit & Lock Part 3</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* ======================================================== */}
        {/* PART 4 GRID (Questions 24 - 30: Interview MCQ) */}
        {/* ======================================================== */}
        <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-850/40 relative">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Part 4 (Questions 24 – 30) · Multiple Choice Interview</span>
              {isPart4Locked && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <Lock size={10} /> Locked & Submitted
                </span>
              )}
              {maxUnlockedPart < 4 && !isPart4Locked && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px] font-normal">
                  <Lock size={12} /> Locked until Part 3 completed
                </span>
              )}
            </h3>
            <span className="text-[11px] text-zinc-400">Shade ONE lozenge [A] [B] [C]</span>
          </div>

          {maxUnlockedPart < 4 ? (
            <div className="p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center text-xs text-zinc-500">
              <Lock size={20} className="mx-auto text-zinc-400 mb-2" />
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                Part 4 is locked on the Answer Sheet.
              </p>
              <p className="mt-1">
                Complete and submit Part 3 to unlock Part 4 Interview (Questions 24–30).
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {QUESTIONS_DATA.filter((q) => q.part === 4).map((q) => {
                  const currentAnswer = answers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {q.id}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
                          {q.question}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(['A', 'B', 'C'] as const).map((letter) => {
                          const isSelected = currentAnswer === letter;
                          let bubble =
                            'bg-white dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300';

                          if (isSelected) {
                            bubble =
                              'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 font-bold';
                          }

                          if (isSubmitted) {
                            if (letter === q.correctAnswer) {
                              bubble = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                            } else if (isSelected && letter !== q.correctAnswer) {
                              bubble = 'bg-red-600 border-red-600 text-white font-bold line-through';
                            }
                          }

                          return (
                            <button
                              key={letter}
                              disabled={isPart4Locked}
                              onClick={() => !isPart4Locked && onSelectAnswer(q.id, letter)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono omr-bubble transition-all ${bubble} ${
                                isPart4Locked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submission button for Part 4 / Final Exam */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 font-mono">
                  Part 4: {part4Answered} / 7 Answered
                </span>

                {!isSubmitted && (
                  <button
                    onClick={onSubmit}
                    disabled={answeredCount < 30}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      answeredCount === 30
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs'
                        : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Send size={12} />
                    <span>Submit & Finalize Mid Term</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Global Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {isSubmitted ? (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Mid Term Graded: {score} / 30 Marks (All 4 Parts Locked)
              </span>
            ) : (
              <span>Overall Progress: {answeredCount} / 30 items filled</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isSubmitted && (
              <button
                onClick={onSubmit}
                disabled={answeredCount < 30}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Send size={13} />
                <span>Finalize & Submit All Parts</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
