/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaybackStatus, SpeechLine } from '../utils/audioEngine';
import { PartNumber } from '../types';
import { Play, Pause, Square, Volume2, BellRing, RotateCcw, CheckCircle2, Lock } from 'lucide-react';

interface ExamAudioBarProps {
  playbackStatus: PlaybackStatus;
  currentStep: string;
  activeLine: SpeechLine | null;
  activeQuestionId: number | null;
  activePart: PartNumber | null;
  activeTrackKey: string | null;
  maxUnlockedPart: PartNumber;
  audioProgress: number; // 0 to 100
  playedTracks: Set<string>;
  onPlayFullExam: () => void;
  onPlayPart: (part: PartNumber) => void;
  onPlayCurrentQuestion: () => void;
  onPauseResume: () => void;
  onStop: () => void;
  onTestChime: () => void;
}

export const ExamAudioBar: React.FC<ExamAudioBarProps> = ({
  playbackStatus,
  currentStep,
  activeLine,
  activeQuestionId,
  activePart,
  activeTrackKey,
  maxUnlockedPart,
  audioProgress,
  playedTracks,
  onPlayFullExam,
  onPlayPart,
  onPlayCurrentQuestion,
  onPauseResume,
  onStop,
  onTestChime,
}) => {
  const isPlaying = playbackStatus === 'playing';
  const isPaused = playbackStatus === 'paused';
  const isActive = isPlaying || isPaused;

  const isFullExamPlayed = playedTracks.has('full-exam');
  const isCurrentQPlayed = activeQuestionId ? playedTracks.has(`q-${activeQuestionId}`) : false;

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Playback Controls & Part Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-1.5">
            {!isActive ? (
              <button
                onClick={onPlayFullExam}
                disabled={isFullExamPlayed}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                  isFullExamPlayed
                    ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 cursor-pointer'
                }`}
                title={isFullExamPlayed ? 'Full exam audio has already been played (1x only)' : 'Play Mid Term exam audio'}
              >
                {isFullExamPlayed ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Play size={12} fill="currentColor" />}
                <span>{isFullExamPlayed ? 'Exam Audio Played (1/1)' : 'Play Exam Audio (1x)'}</span>
              </button>
            ) : (
              <button
                onClick={onPauseResume}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                {isPlaying ? (
                  <>
                    <Pause size={12} fill="currentColor" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={12} fill="currentColor" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            )}

            {isActive && (
              <button
                onClick={onStop}
                className="p-1.5 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                title="Stop playback"
              >
                <Square size={13} fill="currentColor" />
              </button>
            )}
          </div>

          {/* Quick Part Audio Buttons with unlock & played state (1x play only) */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
            {([1, 2, 3, 4] as PartNumber[]).map((p) => {
              const isLocked = p > maxUnlockedPart;
              const isPartPlayed = playedTracks.has(`part-${p}`);
              const isThisPartActive = activePart === p && isActive;

              return (
                <button
                  key={p}
                  disabled={isLocked || isPartPlayed}
                  onClick={() => !isLocked && !isPartPlayed && onPlayPart(p)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    isLocked
                      ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50'
                      : isPartPlayed
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 cursor-not-allowed'
                      : isThisPartActive
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  title={
                    isLocked
                      ? `Complete Part ${p - 1} to unlock Part ${p} audio`
                      : isPartPlayed
                      ? `Part ${p} audio already played (1x single listen only)`
                      : `Play Part ${p} Audio (1x)`
                  }
                >
                  {isLocked && <Lock size={10} />}
                  {isPartPlayed && <CheckCircle2 size={11} className="text-emerald-600" />}
                  <span>Part {p}</span>
                  {isPartPlayed && <span className="text-[9px] font-mono">(1/1)</span>}
                </button>
              );
            })}
          </div>

          {activeQuestionId && !isActive && (
            <button
              onClick={onPlayCurrentQuestion}
              disabled={isCurrentQPlayed}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                isCurrentQPlayed
                  ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer'
              }`}
              title={isCurrentQPlayed ? `Q${activeQuestionId} audio has already played (1x only)` : `Play Question ${activeQuestionId} extract`}
            >
              {isCurrentQPlayed ? <CheckCircle2 size={11} className="text-emerald-500" /> : <RotateCcw size={11} />}
              <span>{isCurrentQPlayed ? `Q${activeQuestionId} (Played)` : `Play Q${activeQuestionId}`}</span>
            </button>
          )}

          {/* Authentic Cambridge Tone Chime */}
          <button
            onClick={onTestChime}
            className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Hear Cambridge [Tone] sound"
          >
            <BellRing size={12} className="text-amber-500" />
            <span className="hidden xl:inline text-[11px]">[Tone] Chime</span>
          </button>
        </div>

        {/* Center: Live Speaker and Step Ticker */}
        <div className="flex-1 w-full lg:w-auto flex items-center justify-center min-w-0 px-2">
          {isActive ? (
            <div className="flex items-center gap-2 max-w-full text-xs">
              <div className="flex items-end gap-0.5 h-3 shrink-0" aria-hidden="true">
                <span className="w-1 bg-indigo-500 rounded-full animate-pulse h-2.5"></span>
                <span className="w-1 bg-indigo-600 rounded-full animate-pulse h-3.5" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 bg-indigo-400 rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }}></span>
              </div>

              <div className="truncate text-zinc-700 dark:text-zinc-300">
                {activeLine ? (
                  <span>
                    <strong className="font-semibold text-zinc-950 dark:text-zinc-100 mr-1.5">
                      {activeLine.speaker}:
                    </strong>
                    <span className="italic">"{activeLine.text}"</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400">{currentStep || 'Listening...'}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Volume2 size={13} />
              <span>Single-track audio (plays 1x only with status tracking)</span>
            </div>
          )}
        </div>

        {/* Right: Audio Rule Badge */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end text-xs">
          <div className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Single Play (No Replay)</span>
          </div>
        </div>
      </div>

      {/* Mandatory Audio Status Bar for Active Play Track */}
      {isActive && (
        <div className="bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800/80 px-4 md:px-6 py-1.5 animate-fade-in">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping inline-block"></span>
                <span>Active Track:</span>
              </span>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px] sm:max-w-xs">
                {currentStep || activeTrackKey || 'Playing audio'}
              </span>
            </div>

            {/* Visual Status Progress Bar */}
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.max(5, Math.min(100, audioProgress))}%` }}
                />
              </div>
              <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                {Math.round(audioProgress)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
