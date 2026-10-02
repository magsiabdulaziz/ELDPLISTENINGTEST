/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAnswers, PartNumber, CandidateInfo, SubmissionRecord } from '../types';
import { QUESTIONS_DATA, CAMBRIDGE_SCALE_30, INSTITUTION_INFO } from '../constants';
import {
  Award,
  CheckCircle2,
  Printer,
  Mail,
  Copy,
  Lock,
  ArrowRight,
  ExternalLink,
  Check,
  LogOut,
} from 'lucide-react';

interface ResultsViewProps {
  answers: UserAnswers;
  candidateInfo: CandidateInfo;
  submissionRecord: SubmissionRecord | null;
  onReviewQuestion: (questionId: number) => void;
  onSignOut?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  answers,
  candidateInfo,
  submissionRecord,
  onReviewQuestion,
  onSignOut,
}) => {
  const [filterPart, setFilterPart] = useState<PartNumber | 'all'>('all');
  const [copied, setCopied] = useState(false);

  // Calculate scores per part
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

  let totalScore = 0;
  const partScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const partTotals = { 1: 8, 2: 10, 3: 5, 4: 7 };

  QUESTIONS_DATA.forEach((q) => {
    if (checkCorrect(q)) {
      totalScore += 1;
      partScores[q.part] += 1;
    }
  });

  const percentage = Math.round((totalScore / QUESTIONS_DATA.length) * 100);

  const scaleInfo =
    CAMBRIDGE_SCALE_30.find((s) => totalScore >= s.minScore && totalScore <= s.maxScore) ||
    CAMBRIDGE_SCALE_30[CAMBRIDGE_SCALE_30.length - 1];

  const filteredQuestions = QUESTIONS_DATA.filter(
    (q) => filterPart === 'all' || q.part === filterPart
  );

  const instructorEmail = INSTITUTION_INFO.instructorEmail;

  // Format email body
  const generateEmailReportText = () => {
    const lines = [
      `=======================================================`,
      `SUKKUR IBA UNIVERSITY - KHAIRPUR CAMPUS`,
      `INSTITUTE OF EMERGING TECHNOLOGIES`,
      `B2 First for Schools: Listening Mid Term Examination`,
      `Course: Think 2 (Chapters 1-4)`,
      `=======================================================`,
      ``,
      `CANDIDATE DETAILS:`,
      `Candidate Name:   ${candidateInfo.name || 'Not Provided'}`,
      `Roll / Reg No:    ${candidateInfo.rollNumber || 'Not Provided'}`,
      `Class / Section:  ${candidateInfo.classSection || 'Not Provided'}`,
      `Candidate Email:  ${candidateInfo.email || 'Not Provided'}`,
      `Examination Date: ${candidateInfo.date || new Date().toISOString()}`,
      `Submission ID:    ${submissionRecord?.submissionId || 'SIBA-KHP-MT-0412'}`,
      ``,
      `EXAMINATION RESULT SUMMARY:`,
      `Total Score:      ${totalScore} / 30 marks (${percentage}%)`,
      `Cambridge Scale:  ${scaleInfo.scaleScore}`,
      `Grade Awarded:    ${scaleInfo.grade}`,
      `CEFR Level:       ${scaleInfo.cefr}`,
      ``,
      `SECTIONAL BREAKDOWN:`,
      `Part 1 (Q1-8):    ${partScores[1]} / 8 marks`,
      `Part 2 (Q9-18):   ${partScores[2]} / 10 marks`,
      `Part 3 (Q19-23):  ${partScores[3]} / 5 marks`,
      `Part 4 (Q24-30):  ${partScores[4]} / 7 marks`,
      ``,
      `DETAILED ITEM-BY-ITEM RESPONSES (1 to 30):`,
    ];

    QUESTIONS_DATA.forEach((q) => {
      const userAns = answers[q.id] || '(No Answer)';
      const isOk = checkCorrect(q);
      lines.push(
        `Q${q.id < 10 ? '0' + q.id : q.id} [Part ${q.part}]: Given: "${userAns}" | Correct Key: "${q.correctAnswer}" | Result: ${isOk ? 'CORRECT' : 'INCORRECT'}`
      );
    });

    lines.push(``);
    lines.push(`Official record transmitted to ${instructorEmail}`);
    lines.push(`=======================================================`);
    return lines.join('\n');
  };

  const handleCopyTranscript = () => {
    const text = generateEmailReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLaunchEmailClient = () => {
    const subject = encodeURIComponent(
      `[Mid Term Exam] B2 Listening - ${candidateInfo.name || 'Student'} (${candidateInfo.rollNumber || 'RollNo'}) - Score: ${totalScore}/30`
    );
    const body = encodeURIComponent(generateEmailReportText());
    window.location.href = `mailto:${instructorEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {/* Locked status banner */}
      <div className="mb-6 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Mid Term Examination Submitted & Finalized. Candidate responses are locked.
          </span>
        </div>
        <span className="font-mono font-bold text-xs bg-white dark:bg-zinc-800 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800">
          ID: {submissionRecord?.submissionId || 'SIBA-KHP-MT-0412'}
        </span>
      </div>

      {/* Official Email Dispatch Card */}
      <div className="mb-8 bg-white dark:bg-zinc-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Instructor Results Transmission
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Official results dispatched to course instructor at Sukkur IBA University.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchEmailClient}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Open in Email App</span>
            </button>

            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Transcript!' : 'Copy Submission Report'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">
              Recipient Email
            </span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 select-all">
              {instructorEmail}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">
              Candidate Name & Roll
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {candidateInfo.name || 'Student'} ({candidateInfo.rollNumber || 'Roll No'})
            </span>
          </div>

          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">
              Status
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 size={13} /> Formatted & Dispatched
            </span>
          </div>
        </div>
      </div>

      {/* Official Examination Certificate Card */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              {INSTITUTION_INFO.institution}
            </div>
            <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
              Mid Term Examination: Official Statement of Results
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Course: {INSTITUTION_INFO.practiceTest} · {INSTITUTION_INFO.component} · 30 Marks Total
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span>Print Official Slip</span>
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Log out and return to Google sign-in page"
              >
                <LogOut size={13} />
                <span>Log Out & Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate Info Summary Box */}
        <div className="mb-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-400 text-[10px] uppercase block">Candidate Name</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {candidateInfo.name || 'CANDIDATE'}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 text-[10px] uppercase block">Roll / Reg No.</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {candidateInfo.rollNumber || '0412'}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 text-[10px] uppercase block">Class / Section</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {candidateInfo.classSection || 'BS-CS Section A'}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 text-[10px] uppercase block">Date & Campus</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {candidateInfo.date || '2026-10-02'} · Khairpur
            </span>
          </div>
        </div>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
              Total Score
            </span>
            <div className="text-3xl font-bold font-mono text-zinc-900 dark:text-white tabular-nums">
              {totalScore} <span className="text-base text-zinc-400">/ 30</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">{percentage}% Aggregate</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
              Cambridge Scale
            </span>
            <div className="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
              {scaleInfo.scaleScore}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Scale Score (140-190)</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
              Examination Grade
            </span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {scaleInfo.grade}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Mid Term Standard</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
              Demonstrated CEFR
            </span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {scaleInfo.cefr}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Proficiency Level</div>
          </div>
        </div>

        {/* Sectional Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map((p) => {
            const pScore = partScores[p as PartNumber];
            const pTotal = partTotals[p as PartNumber];
            const pPct = Math.round((pScore / pTotal) * 100);

            return (
              <div
                key={p}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-center"
              >
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Part {p}
                </span>
                <div className="font-mono font-bold text-base text-zinc-900 dark:text-white mt-0.5">
                  {pScore} / {pTotal}
                </div>
                <div className="text-[11px] text-zinc-500">{pPct}%</div>
              </div>
            );
          })}
        </div>

        {/* Performance Description */}
        <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-xl mb-8 text-xs text-zinc-700 dark:text-zinc-300">
          <strong className="block text-sm font-semibold text-zinc-900 dark:text-white mb-1">
            Faculty Evaluation:
          </strong>
          <p className="leading-relaxed">{scaleInfo.description}</p>
        </div>

        {/* Question Breakdown Table */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Diagnostic Review (Questions 1 to 30) · Immutable Record
            </h3>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterPart('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filterPart === 'all'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPart(p as PartNumber)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                    filterPart === p
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  P{p}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs max-h-[500px] overflow-y-auto">
            {filteredQuestions.map((q) => {
              const candidateAnswer = answers[q.id];
              const isCorrect = checkCorrect(q);

              return (
                <div
                  key={q.id}
                  className="p-3 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                      Q{q.id}
                    </span>
                    <div className="truncate max-w-[280px] sm:max-w-md">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {q.question}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Part {q.part} · Skill: {q.skillTested}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[11px]">Given:</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {candidateAnswer || '—'}
                      </span>
                      {!isCorrect && (
                        <span className="text-[11px] text-zinc-400">
                          (Key: <strong className="text-emerald-600">{q.correctAnswer}</strong>)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onReviewQuestion(q.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Review</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
