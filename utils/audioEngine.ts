/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PartNumber, SpeechLine } from '../types';

export type { SpeechLine };
export type PlaybackStatus = 'idle' | 'playing' | 'paused';

class AudioEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCancelled: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private playSessionId: number = 0;

  public activeTrackKey: string | null = null;
  public onLineChange?: (line: SpeechLine | null, lineIndex: number) => void;
  public onStatusChange?: (status: PlaybackStatus) => void;
  public onStepChange?: (stepName: string) => void;
  public onQuestionChange?: (questionId: number) => void;
  public onPartChange?: (partNumber: PartNumber) => void;
  public onProgressChange?: (progressPercent: number, currentLineIndex: number, totalLines: number, trackKey: string) => void;
  public onTrackFinished?: (trackKey: string) => void;
  public onComplete?: () => void;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playCambridgeChime(): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getAudioContext();
      if (!ctx) {
        setTimeout(resolve, 300);
        return;
      }

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.35); // C5

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(1174.66, now); // D6 harmonic

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        oscHarmonic.start(now);
        osc.stop(now + 0.5);
        oscHarmonic.stop(now + 0.5);

        setTimeout(resolve, 520);
      } catch (e) {
        console.warn('Audio chime error:', e);
        resolve();
      }
    });
  }

  public getVoiceForSpeaker(speaker: string): { voice: SpeechSynthesisVoice | null; pitch: number; rate: number } {
    if (!this.synth || this.voices.length === 0) {
      this.loadVoices();
    }

    const enVoices = this.voices.filter((v) => v.lang.startsWith('en'));
    const gbVoices = enVoices.filter(
      (v) => v.lang.includes('GB') || v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('uk')
    );
    const candidateVoices = gbVoices.length > 0 ? gbVoices : enVoices.length > 0 ? enVoices : this.voices;

    const femaleKeywords = ['female', 'woman', 'zira', 'susan', 'victoria', 'serena', 'karen', 'hazel', 'stephanie', 'catherine', 'samantha', 'mia'];
    const maleKeywords = ['male', 'man', 'david', 'george', 'daniel', 'oliver', 'rishi', 'alex', 'guy', 'james', 'ryan'];

    const femaleVoices = candidateVoices.filter((v) =>
      femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    const maleVoices = candidateVoices.filter((v) =>
      maleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );

    const s = speaker.toLowerCase();

    if (s.includes('reader')) {
      const preferred = candidateVoices.find((v) => v.name.includes('Natural') || v.name.includes('Online') || v.lang.includes('GB')) || candidateVoices[0] || null;
      return { voice: preferred, pitch: 1.0, rate: 0.95 };
    }
    if (s.includes('girl')) {
      return { voice: femaleVoices[0] || candidateVoices[0] || null, pitch: 1.15, rate: 1.0 };
    }
    if (s.includes('boy')) {
      return { voice: maleVoices[0] || candidateVoices[0] || null, pitch: 0.95, rate: 1.02 };
    }
    if (s.includes('man') || s.includes('father') || s.includes('david')) {
      return { voice: maleVoices[1] || maleVoices[0] || candidateVoices[0] || null, pitch: 0.88, rate: 0.98 };
    }
    if (s.includes('woman') || s.includes('teacher') || s.includes('mother')) {
      return { voice: femaleVoices[1] || femaleVoices[0] || candidateVoices[0] || null, pitch: 1.05, rate: 0.98 };
    }
    if (s.includes('mia') || s.includes('designer')) {
      return { voice: femaleVoices[0] || candidateVoices[0] || null, pitch: 1.08, rate: 0.97 };
    }
    if (s.includes('interviewer')) {
      return { voice: maleVoices[0] || candidateVoices[0] || null, pitch: 0.95, rate: 1.0 };
    }
    return { voice: candidateVoices[0] || null, pitch: 1.0, rate: 1.0 };
  }

  public speakLine(line: SpeechLine, speedMultiplier: number = 1.0, sessionId?: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.isCancelled || (sessionId !== undefined && sessionId !== this.playSessionId)) {
        resolve();
        return;
      }
      if (!this.synth) {
        resolve();
        return;
      }

      this.synth.cancel();

      const { voice, pitch, rate } = this.getVoiceForSpeaker(line.speaker);
      const utterance = new SpeechSynthesisUtterance(line.text);

      if (voice) utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = Math.max(0.6, Math.min(1.8, rate * speedMultiplier));
      utterance.lang = 'en-GB';

      this.currentUtterance = utterance;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.currentUtterance = null;
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public sleep(ms: number, sessionId?: number): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (this.isCancelled || (sessionId !== undefined && sessionId !== this.playSessionId)) {
          resolve();
          return;
        }
        if (Date.now() - start >= ms) {
          resolve();
        } else {
          setTimeout(check, 40);
        }
      };
      check();
    });
  }

  public stop() {
    this.isCancelled = true;
    this.playSessionId++; // Invalidate all pending async steps immediately
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    const oldTrack = this.activeTrackKey;
    this.activeTrackKey = null;

    if (this.onStatusChange) this.onStatusChange('idle');
    if (this.onLineChange) this.onLineChange(null, -1);
    if (this.onProgressChange && oldTrack) this.onProgressChange(0, 0, 0, oldTrack);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      if (this.onStatusChange) this.onStatusChange('paused');
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      if (this.onStatusChange) this.onStatusChange('playing');
    }
  }

  /**
   * Play any single sequence of dialogue lines strictly ONCE (no repeats, single track).
   */
  public async playSequence(
    title: string,
    intro: string,
    dialogue: SpeechLine[],
    options: { questionId?: number; part?: PartNumber; trackKey?: string }
  ): Promise<void> {
    // 1. Enforce single track: Stop any active audio and start new session
    this.stop();
    const sessionId = ++this.playSessionId;
    this.isCancelled = false;

    const trackKey = options.trackKey || (options.questionId ? `q-${options.questionId}` : `seq-${Date.now()}`);
    this.activeTrackKey = trackKey;

    if (this.onStatusChange) this.onStatusChange('playing');
    if (options.part && this.onPartChange) this.onPartChange(options.part);
    if (options.questionId && this.onQuestionChange) this.onQuestionChange(options.questionId);

    const totalSteps = 2 + dialogue.length; // Intro + Chime + dialogue lines
    let currentStepNum = 0;

    const updateProg = (stepName: string) => {
      currentStepNum++;
      const pct = Math.min(100, Math.round((currentStepNum / totalSteps) * 100));
      if (this.onStepChange) this.onStepChange(stepName);
      if (this.onProgressChange) this.onProgressChange(pct, currentStepNum, totalSteps, trackKey);
    };

    // Step 1: Intro narration
    updateProg(title);
    if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: intro }, -1);
    await this.speakLine({ speaker: 'Reader', text: intro }, 1.0, sessionId);
    if (this.isCancelled || this.playSessionId !== sessionId) return;

    await this.sleep(1500, sessionId);
    if (this.isCancelled || this.playSessionId !== sessionId) return;

    // Step 2: Cambridge exam tone chime
    updateProg('[Tone]');
    await this.playCambridgeChime();
    if (this.isCancelled || this.playSessionId !== sessionId) return;

    // Step 3: Single play dialogue extract (1x only)
    for (let i = 0; i < dialogue.length; i++) {
      if (this.isCancelled || this.playSessionId !== sessionId) return;
      const line = dialogue[i];
      updateProg(`${title} · ${line.speaker}`);
      if (this.onLineChange) this.onLineChange(line, i);
      await this.speakLine(line, 1.0, sessionId);
      await this.sleep(150, sessionId);
    }

    if (this.isCancelled || this.playSessionId !== sessionId) return;

    // Finalize one-time playback
    if (this.onLineChange) this.onLineChange(null, -1);
    if (this.onStatusChange) this.onStatusChange('idle');
    if (this.onStepChange) this.onStepChange('Playback complete (1/1)');
    if (this.onProgressChange) this.onProgressChange(100, totalSteps, totalSteps, trackKey);
    if (this.onTrackFinished) this.onTrackFinished(trackKey);
    if (this.onComplete) this.onComplete();
    this.activeTrackKey = null;
  }

  /**
   * Play an entire designated Part (1, 2, 3, or 4) strictly ONCE (1x only, single track).
   */
  public async playPart(partNumber: PartNumber): Promise<void> {
    this.stop();
    const sessionId = ++this.playSessionId;
    this.isCancelled = false;

    const trackKey = `part-${partNumber}`;
    this.activeTrackKey = trackKey;

    if (this.onStatusChange) this.onStatusChange('playing');
    if (this.onPartChange) this.onPartChange(partNumber);

    const { QUESTIONS_DATA } = await import('../constants');
    const partQuestions = QUESTIONS_DATA.filter((q) => q.part === partNumber);

    // Calculate total lines for progress
    let totalLinesInPart = 1; // intro
    partQuestions.forEach((q) => {
      totalLinesInPart += 2; // prompt + chime
      totalLinesInPart += (q.dialogue?.length || 1);
    });

    let linesProcessed = 0;
    const emitPartProgress = (stepName: string) => {
      linesProcessed++;
      const pct = Math.min(100, Math.round((linesProcessed / totalLinesInPart) * 100));
      if (this.onStepChange) this.onStepChange(stepName);
      if (this.onProgressChange) this.onProgressChange(pct, linesProcessed, totalLinesInPart, trackKey);
    };

    if (partNumber === 1) {
      const part1Intro =
        'Part 1. You will hear people talking in eight different situations. For questions 1 to 8, choose the best answer, A, B or C.';
      emitPartProgress('Part 1 Instructions');
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: part1Intro }, -1);
      await this.speakLine({ speaker: 'Reader', text: part1Intro }, 1.0, sessionId);
      await this.sleep(2500, sessionId);

      for (const q of partQuestions) {
        if (this.isCancelled || this.playSessionId !== sessionId) return;
        if (this.onQuestionChange) this.onQuestionChange(q.id);

        emitPartProgress(`Question ${q.id}`);
        const introText = `${q.scenario} ${q.question}`;
        if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: introText }, -1);
        await this.speakLine({ speaker: 'Reader', text: introText }, 1.0, sessionId);
        await this.sleep(2000, sessionId);

        emitPartProgress(`[Tone] Q${q.id}`);
        await this.playCambridgeChime();
        if (this.isCancelled || this.playSessionId !== sessionId) return;

        // Single listen (1x only)
        for (let i = 0; i < (q.dialogue?.length || 0); i++) {
          if (this.isCancelled || this.playSessionId !== sessionId) return;
          const line = q.dialogue![i];
          emitPartProgress(`Q${q.id} · ${line.speaker}`);
          if (this.onLineChange) this.onLineChange(line, i);
          await this.speakLine(line, 1.0, sessionId);
          await this.sleep(150, sessionId);
        }

        await this.sleep(1800, sessionId);
      }

      const p1End = 'That is the end of Part 1.';
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p1End }, -1);
      await this.speakLine({ speaker: 'Reader', text: p1End }, 1.0, sessionId);
    } else if (partNumber === 2) {
      const p2Intro =
        'Part 2. You will hear a girl called Poppy talking about upcycling vintage denim clothes. For questions 9 to 18, complete the sentences with a word or short phrase.';
      emitPartProgress('Part 2 Instructions');
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p2Intro }, -1);
      await this.speakLine({ speaker: 'Reader', text: p2Intro }, 1.0, sessionId);
      await this.sleep(3000, sessionId);

      emitPartProgress('[Tone] Part 2');
      await this.playCambridgeChime();
      if (this.isCancelled || this.playSessionId !== sessionId) return;

      const { PART_2_AUDIO } = await import('../constants');
      for (let i = 0; i < PART_2_AUDIO.dialogue.length; i++) {
        if (this.isCancelled || this.playSessionId !== sessionId) return;
        const line = PART_2_AUDIO.dialogue[i];
        emitPartProgress(`Part 2 · Poppy`);
        if (this.onLineChange) this.onLineChange(line, i);
        await this.speakLine(line, 1.0, sessionId);
        await this.sleep(150, sessionId);
      }

      const p2End = 'That is the end of Part 2.';
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p2End }, -1);
      await this.speakLine({ speaker: 'Reader', text: p2End }, 1.0, sessionId);
    } else if (partNumber === 3) {
      const p3Intro =
        'Part 3. You will hear five short extracts in which people are talking about travelling to school. For questions 19 to 23, choose from the list (A to H) what each speaker says about their journey.';
      emitPartProgress('Part 3 Instructions');
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p3Intro }, -1);
      await this.speakLine({ speaker: 'Reader', text: p3Intro }, 1.0, sessionId);
      await this.sleep(3000, sessionId);

      const { PART_3_AUDIO } = await import('../constants');
      for (let i = 0; i < PART_3_AUDIO.dialogue.length; i++) {
        if (this.isCancelled || this.playSessionId !== sessionId) return;
        const line = PART_3_AUDIO.dialogue[i];
        emitPartProgress(`Part 3 · ${line.speaker}`);
        if (this.onLineChange) this.onLineChange(line, i);

        if (line.text.startsWith('[Tone')) {
          await this.playCambridgeChime();
        } else {
          await this.speakLine(line, 1.0, sessionId);
        }
        await this.sleep(200, sessionId);
      }

      const p3End = 'That is the end of Part 3.';
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p3End }, -1);
      await this.speakLine({ speaker: 'Reader', text: p3End }, 1.0, sessionId);
    } else if (partNumber === 4) {
      const p4Intro =
        'Part 4. You will hear an interview with a costume designer called Mia Lawson. For questions 24 to 30, choose the best answer, A, B or C.';
      emitPartProgress('Part 4 Instructions');
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p4Intro }, -1);
      await this.speakLine({ speaker: 'Reader', text: p4Intro }, 1.0, sessionId);
      await this.sleep(3000, sessionId);

      emitPartProgress('[Tone] Part 4');
      await this.playCambridgeChime();
      if (this.isCancelled || this.playSessionId !== sessionId) return;

      const { PART_4_AUDIO } = await import('../constants');
      for (let i = 0; i < PART_4_AUDIO.dialogue.length; i++) {
        if (this.isCancelled || this.playSessionId !== sessionId) return;
        const line = PART_4_AUDIO.dialogue[i];
        emitPartProgress(`Part 4 · ${line.speaker}`);
        if (this.onLineChange) this.onLineChange(line, i);
        await this.speakLine(line, 1.0, sessionId);
        await this.sleep(150, sessionId);
      }

      const p4End = 'That is the end of Part 4.';
      if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: p4End }, -1);
      await this.speakLine({ speaker: 'Reader', text: p4End }, 1.0, sessionId);
    }

    if (this.isCancelled || this.playSessionId !== sessionId) return;

    if (this.onLineChange) this.onLineChange(null, -1);
    if (this.onStatusChange) this.onStatusChange('idle');
    if (this.onStepChange) this.onStepChange(`Part ${partNumber} completed (1/1)`);
    if (this.onProgressChange) this.onProgressChange(100, totalLinesInPart, totalLinesInPart, trackKey);
    if (this.onTrackFinished) this.onTrackFinished(trackKey);
    if (this.onComplete) this.onComplete();
    this.activeTrackKey = null;
  }

  /**
   * Play the full mid-term exam narration sequentially (1x only, single track).
   */
  public async playFullExam(): Promise<void> {
    this.stop();
    const sessionId = ++this.playSessionId;
    this.isCancelled = false;

    const trackKey = 'full-exam';
    this.activeTrackKey = trackKey;

    if (this.onStatusChange) this.onStatusChange('playing');

    const examIntro =
      'This is the Listening test for the B2 First for Schools Mid Term Examination based on Think 2, Chapters 1 to 4. I am going to give you the instructions for this test.';
    if (this.onStepChange) this.onStepChange('Mid Term Examination Instructions');
    if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: examIntro }, -1);
    await this.speakLine({ speaker: 'Reader', text: examIntro }, 1.0, sessionId);
    await this.sleep(3000, sessionId);

    for (let p = 1; p <= 4; p++) {
      if (this.isCancelled || this.playSessionId !== sessionId) return;
      await this.playPart(p as PartNumber);
      if (this.isCancelled || this.playSessionId !== sessionId) return;
      await this.sleep(3000, sessionId);
    }

    if (this.isCancelled || this.playSessionId !== sessionId) return;

    const examEnd =
      'That is the end of the test. Please check and submit your answers on the answer sheet.';
    if (this.onStepChange) this.onStepChange('End of Examination');
    if (this.onLineChange) this.onLineChange({ speaker: 'Reader', text: examEnd }, -1);
    await this.speakLine({ speaker: 'Reader', text: examEnd }, 1.0, sessionId);

    if (this.onTrackFinished) this.onTrackFinished(trackKey);
    if (this.onComplete) this.onComplete();
    this.activeTrackKey = null;
  }
}

export const audioEngine = new AudioEngine();
