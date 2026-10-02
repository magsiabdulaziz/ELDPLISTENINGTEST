/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PartNumber = 1 | 2 | 3 | 4;
export type QuestionType = 'multiple-choice-3' | 'sentence-completion' | 'multiple-matching';

export interface DialogueLine {
  speaker: string;
  text: string;
  isEvidence?: boolean;
}

export type SpeechLine = DialogueLine;

export interface VocabularyItem {
  id: string;
  term: string;
  phonetic: string;
  type: string;
  definition: string;
  inContext: string;
  part: number;
  questionId: number;
  example: string;
  cefrLevel: string;
}

export interface MatchingOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  text: string;
}

export interface QuestionData {
  id: number;
  part: PartNumber;
  type: QuestionType;
  scenario?: string;
  question: string;
  options?: {
    key: 'A' | 'B' | 'C';
    text: string;
  }[];
  sentencePrefix?: string;
  sentenceSuffix?: string;
  acceptedAnswers?: string[];
  speakerNumber?: number;
  correctAnswer: string;
  skillTested: string;
  evidenceQuote: string;
  explanation: {
    correct: string;
    distractors?: {
      key: string;
      reason: string;
    }[];
    examTip: string;
  };
  dialogue?: DialogueLine[];
  audioScript?: {
    intro: string;
    extractText: string;
  };
}

export interface PartAudioTrack {
  part: PartNumber;
  title: string;
  description: string;
  instructions: string;
  dialogue: DialogueLine[];
}

export type ViewTab = 'test' | 'answer-sheet' | 'results';
export type TestMode = 'exam';

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  verified: boolean;
  signedInAt: string;
}

export interface CandidateInfo {
  name: string;
  rollNumber: string;
  classSection: string;
  email: string;
  date: string;
}

export interface SubmissionRecord {
  submissionId: string;
  submittedAt: string;
  candidate: CandidateInfo;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  scaleScore: string;
  cefr: string;
  partScores: {
    1: number;
    2: number;
    3: number;
    4: number;
  };
  answers: UserAnswers;
  emailSentTo: string;
  submittedParts?: number[];
}

export interface UserAnswers {
  [questionId: number]: string;
}