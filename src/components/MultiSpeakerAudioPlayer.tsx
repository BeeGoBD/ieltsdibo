import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, UserCheck, Users, Headphones } from 'lucide-react';
import { ListeningSection } from '../utils/listeningQuestions';

interface MultiSpeakerAudioPlayerProps {
  section: ListeningSection;
  lang?: 'bn' | 'en';
  onSectionEnd?: () => void;
}

interface DialogueTurn {
  speaker: string;
  text: string;
  isFemale: boolean;
}

export const MultiSpeakerAudioPlayer: React.FC<MultiSpeakerAudioPlayerProps> = ({
  section,
  lang = 'bn',
  onSectionEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(-1);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const [dialogueTurns, setDialogueTurns] = useState<DialogueTurn[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.94);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const turnsRef = useRef<DialogueTurn[]>([]);
  const activeTurnRef = useRef<number>(-1);
  const isPlayingRef = useRef<boolean>(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pauseTimeoutRef = useRef<any>(null);

  // Female name detection for authentic voice pairing
  const isLikelyFemale = (name: string): boolean => {
    const lower = name.toLowerCase();
    const femaleKeywords = [
      'sarah', 'emma', 'mrs', 'ms', 'miss', 'chloe', 'maya', 'helena', 
      'priya', 'fiona', 'woman', 'girl', 'lady', 'mother', 'female', 'eleanor',
      'higgins', 'evelyn', 'anna', 'lisa', 'clara', 'sophie'
    ];
    return femaleKeywords.some((k) => lower.includes(k));
  };

  // Parse audioScript into distinct human turns
  useEffect(() => {
    const rawLines = section.audioScript.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: DialogueTurn[] = [];

    rawLines.forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0 && colonIndex < 40) {
        const speakerName = line.slice(0, colonIndex).replace(/['"“”]/g, '').trim();
        const speechText = line.slice(colonIndex + 1).replace(/^["“']|["”']$/g, '').trim();
        if (speechText) {
          parsed.push({
            speaker: speakerName,
            text: speechText,
            isFemale: isLikelyFemale(speakerName),
          });
        }
      } else {
        // Monologue or narrator statement
        parsed.push({
          speaker: section.speakerNames?.[0] || 'Official Cambridge Examiner',
          text: line.replace(/^["“']|["”']$/g, '').trim(),
          isFemale: isLikelyFemale(section.speakerNames?.[0] || ''),
        });
      }
    });

    setDialogueTurns(parsed);
    turnsRef.current = parsed;
    stopAudio();
  }, [section]);

  // Load browser voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    activeTurnRef.current = -1;
    setCurrentTurnIndex(-1);
    setCurrentSpeaker('');
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Find human-like British or English voice based on speaker gender
  const pickVoiceForTurn = (turn: DialogueTurn): { voice: SpeechSynthesisVoice | null; pitch: number; rate: number } => {
    if (!availableVoices.length) {
      return {
        voice: null,
        pitch: turn.isFemale ? 1.15 : 0.88,
        rate: playbackSpeed,
      };
    }

    const gbVoices = availableVoices.filter((v) =>
      v.lang.toLowerCase().includes('en-gb') ||
      v.name.toLowerCase().includes('british') ||
      v.name.toLowerCase().includes('uk') ||
      v.name.toLowerCase().includes('english')
    );

    const pool = gbVoices.length ? gbVoices : availableVoices;

    if (turn.isFemale) {
      const femaleVoice = pool.find((v) =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('fiona') ||
        v.name.toLowerCase().includes('hazel') ||
        v.name.toLowerCase().includes('zira')
      );
      return {
        voice: femaleVoice || pool[0] || null,
        pitch: 1.12,
        rate: playbackSpeed,
      };
    } else {
      const maleVoice = pool.find((v) =>
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('oliver') ||
        v.name.toLowerCase().includes('george') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('arthur')
      );
      return {
        voice: maleVoice || pool[pool.length > 1 ? 1 : 0] || null,
        pitch: 0.86,
        rate: playbackSpeed * 0.97,
      };
    }
  };

  // Play dialogue turn by turn with realistic human pauses
  const playTurn = (index: number) => {
    if (!isPlayingRef.current || index >= turnsRef.current.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentTurnIndex(-1);
      setCurrentSpeaker('');
      if (onSectionEnd) onSectionEnd();
      return;
    }

    const turn = turnsRef.current[index];
    activeTurnRef.current = index;
    setCurrentTurnIndex(index);
    setCurrentSpeaker(turn.speaker);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(turn.text);
    const { voice, pitch, rate } = pickVoiceForTurn(turn);

    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = 'en-GB';

    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      // Natural human conversational breathing pause between different speakers (450ms)
      pauseTimeoutRef.current = setTimeout(() => {
        playTurn(index + 1);
      }, 480);
    };

    utterance.onerror = (err) => {
      console.warn('Speech playback notice:', err);
      if (isPlayingRef.current) {
        pauseTimeoutRef.current = setTimeout(() => {
          playTurn(index + 1);
        }, 400);
      }
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      const startIndex = activeTurnRef.current >= 0 && activeTurnRef.current < turnsRef.current.length
        ? activeTurnRef.current
        : 0;
      playTurn(startIndex);
    }
  };

  const handleRestart = () => {
    stopAudio();
    setTimeout(() => {
      isPlayingRef.current = true;
      setIsPlaying(true);
      playTurn(0);
    }, 150);
  };

  return (
    <div className="bg-gradient-to-r from-sky-950 via-[#0A2540] to-slate-950 p-4 md:p-5 rounded-3xl text-white shadow-lg border border-sky-800/40 space-y-3.5">
      {/* Top Header & Speakers Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs md:text-sm text-white">
                {section.title}
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                Multi-Voice Audio
              </span>
            </div>
            <span className="text-[11px] text-sky-200 block truncate max-w-sm md:max-w-md">
              {section.context}
            </span>
          </div>
        </div>

        {/* Participating Speakers Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Users className="w-3.5 h-3.5 text-sky-300 shrink-0" />
          {(section.speakerNames || []).map((sp, idx) => {
            const isFem = isLikelyFemale(sp);
            const isCurrentlySpeaking = currentSpeaker.toLowerCase().includes(sp.toLowerCase().split(' ')[0]);
            return (
              <span
                key={idx}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  isCurrentlySpeaking
                    ? 'bg-amber-400 text-slate-950 scale-105 shadow-sm ring-2 ring-amber-300'
                    : isFem
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-400/30'
                    : 'bg-sky-500/20 text-sky-200 border border-sky-400/30'
                }`}
              >
                {sp}
              </span>
            );
          })}
        </div>
      </div>

      {/* Live Speaker Status & Soundwave Indicator */}
      <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isPlaying ? (
            <div className="flex items-end gap-1 h-5 px-1">
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s] h-5"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.25s] h-2"></span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <Volume2 className="w-3 h-3 text-slate-400" />
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold text-sky-100 flex items-center gap-1.5">
              {isPlaying && currentSpeaker ? (
                <>
                  <UserCheck className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300 font-extrabold">{currentSpeaker}</span>
                  <span className="text-slate-300">
                    {lang === 'bn' ? 'কথা বলছেন...' : 'is speaking...'}
                  </span>
                </>
              ) : (
                <span className="text-slate-300">
                  {lang === 'bn'
                    ? 'অডিও শুরু করতে প্লে বাটনে ক্লিক করুন (মানবসদৃশ বহুভাষী কণ্ঠস্বর)'
                    : 'Click play to start natural human-style multi-speaker conversation'}
                </span>
              )}
            </span>
            {currentTurnIndex >= 0 && (
              <span className="text-[10px] text-slate-400 font-mono block">
                Turn {currentTurnIndex + 1} of {dialogueTurns.length}
              </span>
            )}
          </div>
        </div>

        {/* Speed Switcher */}
        <div className="flex items-center gap-1 text-[10px] bg-white/10 p-1 rounded-xl">
          {[0.85, 0.94, 1.05].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              {spd === 0.94 ? 'Normal' : `${spd}x`}
            </button>
          ))}
        </div>
      </div>

      {/* Active Dialogue Transcript Display with highlighting */}
      <div className="bg-slate-900/60 p-3 rounded-2xl max-h-36 overflow-y-auto space-y-2 border border-white/5 scrollbar-thin text-xs">
        {dialogueTurns.map((turn, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl transition-all ${
              currentTurnIndex === i
                ? 'bg-amber-400/20 border border-amber-400/40 text-white font-medium'
                : 'text-slate-400 opacity-60'
            }`}
          >
            <span
              className={`font-bold text-[11px] block mb-0.5 ${
                turn.isFemale ? 'text-rose-300' : 'text-sky-300'
              }`}
            >
              {turn.speaker}:
            </span>
            <p className="leading-relaxed">"{turn.text}"</p>
          </div>
        ))}
      </div>

      {/* Main Playback Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleRestart}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'প্রথম থেকে শুনুন' : 'Restart Audio'}</span>
        </button>

        <button
          onClick={handleTogglePlay}
          className={`px-6 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-400'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>{lang === 'bn' ? 'অডিও থামান' : 'Pause Dialogue'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{lang === 'bn' ? 'স্বাভাবিক মানবকণ্ঠে শুনুন' : 'Play Human Conversation'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
