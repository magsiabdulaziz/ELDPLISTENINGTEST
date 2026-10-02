/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuestionData, TestMode } from '../types';
import { PART_3_MATCHING_OPTIONS } from '../constants';
import { Play, CheckCircle2, XCircle, ChevronDown, ChevronUp, Flag, Lightbulb, Lock } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionData;
  selectedAnswer?: string;
  onSelectAnswer: (questionId: number, answer: string) => void;
  testMode: TestMode;
  isFlagged: boolean;
  onToggleFlag: (questionId: number) => void;
  onPlayExtract: (questionId: number) => void;
  isPlayingThis: boolean;
  isSubmitted?: boolean;
  isPartSubmitted?: boolean;
  hasPlayedAudio?: boolean;
  audioProgress?: number;
  usedMatchingLetters?: Set<string>;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer = '',
  onSelectAnswer,
  testMode,
  isFlagged,
  onToggleFlag,
  onPlayExtract,
  isPlayingThis,
  isSubmitted = false,
  isPartSubmitted = false,
  hasPlayedAudio = false,
  audioProgress = 0,
  usedMatchingLetters = new Set(),
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  // Response locking is enforced if entire exam submitted OR this part submitted
  const isLocked = isSubmitted || isPartSubmitted;
  const isExam = testMode === 'exam' && !isSubmitted;
  const showFeedback = !isExam && (hasCheckedAnswer || isSubmitted);

  // Check correctness
  const isCorrect = (() => {
    if (!selectedAnswer.trim()) return false;
    const cleanUser = selectedAnswer.trim().toLowerCase();
    if (question.type === 'sentence-completion' && question.acceptedAnswers) {
      return question.acceptedAnswers.some(
        (ans) => ans.toLowerCase() === cleanUser || cleanUser.includes(ans.toLowerCase())
      );
    }
    return cleanUser === question.correctAnswer.trim().toLowerCase();
  })();

  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 md:p-6 transition-all shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            Question {question.id}
          </span>
          <span aria-hidden="true">·</span>
          <span>Part {question.part}</span>
          <span aria-hidden="true">·</span>
          <span>1 mark</span>

          {isPartSubmitted && !isSubmitted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-[10px] font-semibold">
              <Lock size={10} />
              <span>Part {question.part} Locked</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Extract Trigger (1x single play only; cannot replay) */}
          <button
            onClick={() => !hasPlayedAudio && onPlayExtract(question.id)}
            disabled={hasPlayedAudio}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              hasPlayedAudio
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-200 dark:border-zinc-700'
                : isPlayingThis
                ? 'bg-indigo-600 text-white animate-pulse'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 cursor-pointer'
            }`}
            title={hasPlayedAudio ? 'Audio extract already played (1x only)' : 'Listen to audio extract (1x only)'}
          >
            {hasPlayedAudio ? (
              <>
                <CheckCircle2 size={11} className="text-emerald-500" />
                <span>Played (1/1)</span>
              </>
            ) : isPlayingThis ? (
              <>
                <Play size={11} fill="currentColor" />
                <span>Playing...</span>
              </>
            ) : (
              <>
                <Play size={11} fill="currentColor" />
                <span>Play Audio (1x)</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleFlag(question.id)}
            className={`p-1.5 rounded-md transition-colors ${
              isFlagged
                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isFlagged ? 'Remove flag' : 'Flag for review'}
          >
            <Flag size={14} fill={isFlagged ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Real-time Status Bar for this question when actively playing */}
      {isPlayingThis && (
        <div className="mb-3 p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-lg text-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span>Playing Question {question.id} Audio Extract</span>
            </span>
            <span className="font-mono">{Math.round(audioProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${Math.max(5, Math.min(100, audioProgress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Scenario / Lead-in */}
      {question.scenario && (
        <p className="text-sm italic text-zinc-600 dark:text-zinc-400 mb-1.5">
          {question.scenario}
        </p>
      )}

      {/* Main Question Stem */}
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4 leading-snug">
        {question.question}
      </h3>

      {/* ======================================================== */}
      {/* 1. Multiple Choice (Part 1 & Part 4: 3 Options A, B, C) */}
      {/* ======================================================== */}
      {question.type === 'multiple-choice-3' && question.options && (
        <div className="space-y-2.5 mb-4" role="radiogroup" aria-label={`Question ${question.id} options`}>
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            const isThisCorrect = opt.key === question.correctAnswer;

            let optionStyle =
              'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200';

            if (isSelected) {
              optionStyle =
                'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium ring-1 ring-zinc-900 dark:ring-zinc-100';
            }

            if (showFeedback) {
              if (isThisCorrect) {
                optionStyle =
                  'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected && !isThisCorrect) {
                optionStyle =
                  'border-red-400 bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-200 ring-1 ring-red-400';
              }
            }

            return (
              <label
                key={opt.key}
                onClick={() => {
                  if (!isLocked) {
                    onSelectAnswer(question.id, opt.key);
                  }
                }}
                className={`flex items-start gap-3.5 p-3 rounded-lg border transition-all ${
                  isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${optionStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 transition-colors ${
                    showFeedback && isThisCorrect
                      ? 'bg-emerald-600 text-white'
                      : showFeedback && isSelected && !isThisCorrect
                      ? 'bg-red-600 text-white'
                      : isSelected
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {opt.key}
                </div>

                <span className="text-sm flex-1 leading-snug pt-0.5">{opt.text}</span>

                {showFeedback && isThisCorrect && (
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 self-center" />
                )}
                {showFeedback && isSelected && !isThisCorrect && (
                  <XCircle size={18} className="text-red-600 dark:text-red-400 shrink-0 self-center" />
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. Sentence Completion (Part 2: Gap Fill) */}
      {/* ======================================================== */}
      {question.type === 'sentence-completion' && (
        <div className="mb-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-sm md:text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
            <span>{question.sentencePrefix} </span>
            <span className="inline-block relative my-1">
              <input
                type="text"
                disabled={isLocked}
                value={selectedAnswer}
                onChange={(e) => !isLocked && onSelectAnswer(question.id, e.target.value)}
                placeholder={isLocked ? '(locked)' : 'type word(s)...'}
                className={`font-mono text-sm px-3 py-1.5 rounded-lg border focus:outline-hidden transition-all min-w-[160px] max-w-[240px] ${
                  isLocked ? 'cursor-not-allowed opacity-90' : ''
                } ${
                  showFeedback
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                    : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white'
                }`}
              />
            </span>
            <span> {question.sentenceSuffix}</span>
          </div>

          {showFeedback && (
            <div className="mt-2 text-xs font-mono">
              {isCorrect ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Accepted answer
                </span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center gap-1">
                  <XCircle size={13} /> Key: [{question.correctAnswer}]
                  {question.acceptedAnswers && question.acceptedAnswers.length > 1 && (
                    <span className="text-zinc-500 font-normal">
                      (Also accepted: {question.acceptedAnswers.join(', ')})
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. Multiple Matching (Part 3: Options A–H) */}
      {/* ======================================================== */}
      {question.type === 'multiple-matching' && (
        <div className="mb-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
            Select one letter from A to H for {question.question}:
          </div>

          <div className="grid grid-cols-1 gap-2">
            {PART_3_MATCHING_OPTIONS.map((opt) => {
              const isSelected = selectedAnswer === opt.key;
              const isUsedElsewhere = usedMatchingLetters.has(opt.key) && !isSelected;
              const isThisCorrect = opt.key === question.correctAnswer;

              let style =
                'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300';

              if (isSelected) {
                style =
                  'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium ring-1 ring-zinc-900 dark:ring-zinc-100';
              }

              if (showFeedback) {
                if (isThisCorrect) {
                  style =
                    'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isThisCorrect) {
                  style =
                    'border-red-400 bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-200 ring-1 ring-red-400';
                }
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isLocked}
                  onClick={() => !isLocked && onSelectAnswer(question.id, opt.key)}
                  className={`text-left p-2.5 rounded-lg border flex items-start gap-2.5 text-xs transition-all ${
                    isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                  } ${style} ${isUsedElsewhere && !isSelected ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="flex-1 leading-snug">{opt.text}</span>
                  {isUsedElsewhere && (
                    <span className="text-[10px] text-zinc-400 italic shrink-0 self-center">Used</span>
                  )}
                  {showFeedback && isThisCorrect && (
                    <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 self-center" />
                  )}
                  {showFeedback && isSelected && !isThisCorrect && (
                    <XCircle size={15} className="text-red-600 dark:text-red-400 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Practice / Post-submission feedback */}
      {!isExam && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(hasCheckedAnswer || isSubmitted) && (
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <Lightbulb size={13} />
                <span>{showExplanation ? 'Hide Explanation' : 'Show Evidence & Explanation'}</span>
                {showExplanation ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>

          {showFeedback && (
            <div className="text-xs font-medium">
              {isCorrect ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Correct (+1 mark)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                  <XCircle size={13} /> Incorrect (Key: {question.correctAnswer})
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Detailed Explanation Drawer */}
      {showExplanation && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs space-y-3 bg-zinc-50/70 dark:bg-zinc-800/40 p-4 rounded-lg">
          {question.evidenceQuote && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">
                Listening Evidence:
              </span>
              <blockquote className="p-2.5 border-l-2 border-indigo-500 bg-white dark:bg-zinc-900 rounded-r text-zinc-800 dark:text-zinc-200 italic font-serif">
                "{question.evidenceQuote}"
              </blockquote>
            </div>
          )}

          <div>
            <strong className="text-emerald-700 dark:text-emerald-400">
              Target Key ({question.correctAnswer}):
            </strong>{' '}
            <span className="text-zinc-700 dark:text-zinc-300">
              {question.explanation.correct}
            </span>
          </div>

          {question.explanation.distractors && question.explanation.distractors.length > 0 && (
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                Distractor Analysis:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-zinc-600 dark:text-zinc-400">
                {question.explanation.distractors.map((dist) => (
                  <li key={dist.key}>
                    <strong className="text-zinc-700 dark:text-zinc-300">Option {dist.key}:</strong> {dist.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded text-amber-900 dark:text-amber-200">
            <span className="font-semibold">B2 First Exam Tip: </span>
            <span>{question.explanation.examTip}</span>
          </div>
        </div>
      )}
    </article>
  );
};
