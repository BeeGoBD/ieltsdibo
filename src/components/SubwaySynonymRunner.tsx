import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Trophy,
  Flame,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  Play,
  Pause,
  Zap,
  CheckCircle2,
  XCircle,
  Crown,
  Hand,
  Clock,
  Sparkle,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import {
  generateRandomChallenge,
  ActiveGateChallenge,
} from '../data/synonymGameData';
import { AppLanguage, UserProfile } from '../types';

interface SubwaySynonymRunnerProps {
  user: UserProfile;
  lang?: AppLanguage;
  onSubscribe?: () => void;
  isTrialExpired?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'spark';
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
}

interface RingArch {
  z: number; // 0 (near) to 1 (far)
}

export const SubwaySynonymRunner: React.FC<SubwaySynonymRunnerProps> = ({
  user,
  lang = 'bn',
  onSubscribe,
  isTrialExpired = false,
}) => {
  const isBn = lang === 'bn';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game States
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'game_over'>('intro');
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => sound.isEnabled());

  // Score & Metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsMastered, setWordsMastered] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('subway_synonym_high_score');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Current active word challenge
  const [activeChallenge, setActiveChallenge] = useState<ActiveGateChallenge | null>(null);
  const [lastMistake, setLastMistake] = useState<{
    target: string;
    correct: string;
    picked: string;
  } | null>(null);

  // Floating Toast on correct match
  const [successToast, setSuccessToast] = useState<{
    text: string;
    scoreGained: number;
  } | null>(null);

  // Show swipe guide hint at the start of game
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Current player lane for on-screen HUD (0, 1, 2)
  const [currentLaneUi, setCurrentLaneUi] = useState(1);

  // Gate distance progress for timer bar (0 to 1)
  const [approachProgress, setApproachProgress] = useState(0);

  // Game Engine Internal References (mutable for 60fps loop)
  const currentLaneRef = useRef<number>(1); // 0 = Left, 1 = Center, 2 = Right
  const targetLaneRef = useRef<number>(1);
  const lanePositionXRef = useRef<number>(1); // lerped position
  const tiltAngleRef = useRef<number>(0);
  const jumpOffsetRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const jumpVelocityRef = useRef<number>(0);

  // 2X TIME ADJUSTED:
  // Base speed set to 0.0044 (~3.7s approach) for an energetic, readable arcade pace
  const BASE_SPEED = 0.0044;
  const gameSpeedRef = useRef<number>(BASE_SPEED);
  const gateZRef = useRef<number>(1.0);
  const trackScrollRef = useRef<number>(0);
  const runCycleRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ringArchesRef = useRef<RingArch[]>([
    { z: 0.2 },
    { z: 0.5 },
    { z: 0.8 },
  ]);
  const starsRef = useRef<Star[]>([]);
  const usedWordIdsRef = useRef<Set<string>>(new Set());
  const activeChallengeRef = useRef<ActiveGateChallenge | null>(null);
  const isGameOverRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const screenShakeRef = useRef<number>(0);

  // Swipe Gestures Tracking (Touch + Mouse Drag)
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isMouseDownRef = useRef<boolean>(false);

  // Initialize stars for night sky
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.38,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.3 + Math.random() * 0.7,
        pulseSpeed: 0.02 + Math.random() * 0.04,
      });
    }
    starsRef.current = stars;
  }, []);

  // Spawn Next Challenge
  const spawnNextChallenge = useCallback(() => {
    const { challenge } = generateRandomChallenge(usedWordIdsRef.current);
    activeChallengeRef.current = challenge;
    setActiveChallenge(challenge);
    gateZRef.current = 1.0;
  }, []);

  // Controls: Steer Left
  const handleMoveLeft = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    if (targetLaneRef.current > 0) {
      targetLaneRef.current -= 1;
      currentLaneRef.current = targetLaneRef.current;
      setCurrentLaneUi(targetLaneRef.current);
      sound.playClick();
      setShowSwipeHint(false);
    }
  }, []);

  // Controls: Steer Right
  const handleMoveRight = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    if (targetLaneRef.current < 2) {
      targetLaneRef.current += 1;
      currentLaneRef.current = targetLaneRef.current;
      setCurrentLaneUi(targetLaneRef.current);
      sound.playClick();
      setShowSwipeHint(false);
    }
  }, []);

  // Controls: Jump
  const handleJump = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    if (!isJumpingRef.current) {
      isJumpingRef.current = true;
      jumpVelocityRef.current = 13.5;
      sound.playSelect();
      setShowSwipeHint(false);
    }
  }, []);

  // Start / Restart Game
  const startNewGame = useCallback(() => {
    sound.playSelect();
    setScore(0);
    setStreak(0);
    setWordsMastered(0);
    setLastMistake(null);
    setSuccessToast(null);
    setShowSwipeHint(true);

    currentLaneRef.current = 1;
    targetLaneRef.current = 1;
    setCurrentLaneUi(1);
    lanePositionXRef.current = 1;
    tiltAngleRef.current = 0;
    jumpOffsetRef.current = 0;
    isJumpingRef.current = false;
    gameSpeedRef.current = BASE_SPEED;
    particlesRef.current = [];
    usedWordIdsRef.current.clear();
    isGameOverRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
    screenShakeRef.current = 0;

    spawnNextChallenge();
    setGameState('playing');

    // Fade out swipe hint after 5 seconds
    setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
  }, [spawnNextChallenge, BASE_SPEED]);

  // Keyboard navigation as secondary fallback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleMoveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMoveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        handleJump();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        setIsPaused((prev) => {
          isPausedRef.current = !prev;
          return !prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleMoveLeft, handleMoveRight, handleJump]);

  // -------------------------------------------------------------
  // PURE SWIPE GESTURE ENGINE (Touch + Mouse Drag)
  // -------------------------------------------------------------
  const processSwipe = (deltaX: number, deltaY: number) => {
    const minDistance = 24;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > minDistance) {
      if (deltaX > 0) {
        handleMoveRight();
      } else {
        handleMoveLeft();
      }
    } else if (absY > absX && deltaY < -minDistance) {
      handleJump();
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent document scrolling while swiping
    if (gameState === 'playing') {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStartRef.current || gameState !== 'playing') return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;
    processSwipe(deltaX, deltaY);
    dragStartRef.current = null;
  };

  // Mouse Drag / Swipe for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    isMouseDownRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !dragStartRef.current || gameState !== 'playing') return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Fast trigger on mouse drag
    if (Math.abs(deltaX) > 40 || deltaY < -40) {
      processSwipe(deltaX, deltaY);
      dragStartRef.current = null;
      isMouseDownRef.current = false;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isMouseDownRef.current && dragStartRef.current && gameState === 'playing') {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      processSwipe(deltaX, deltaY);
    }
    isMouseDownRef.current = false;
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    dragStartRef.current = null;
  };

  // Sound Toggle
  const toggleAudio = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  // Create Confetti Burst on Success
  const createConfetti = (x: number, y: number, count: number = 40) => {
    const colors = ['#F59E0B', '#10B981', '#06B6D4', '#EC4899', '#8B5CF6', '#FBBF24', '#34D399', '#38BDF8'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3.5 + Math.random() * 5,
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.random() * 25,
        shape: Math.random() > 0.4 ? 'circle' : 'spark',
      });
    }
  };

  // Spark and Thruster trail behind runner
  const createRunnerTrail = (x: number, y: number) => {
    // Footstep dust / light sparks
    particlesRef.current.push({
      x: x + (Math.random() - 0.5) * 18,
      y: y + 2,
      vx: (Math.random() - 0.5) * 2,
      vy: -0.5 - Math.random() * 1.5,
      color: Math.random() > 0.4 ? '#06B6D4' : '#F59E0B',
      size: 2.5 + Math.random() * 3,
      alpha: 0.9,
      life: 0,
      maxLife: 18,
      shape: 'circle',
    });
  };

  // -------------------------------------------------------------
  // HIGH-OCTANE 60 FPS 3D PERSPECTIVE CANVAS GAME LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;

      if (!isPausedRef.current && !isGameOverRef.current) {
        // 1. Advance Track & Run Cycle
        trackScrollRef.current += gameSpeedRef.current * 75;
        runCycleRef.current += 0.22;

        // 2. Interpolate Lane Position (Lerp for smooth subway drift)
        const targetX = targetLaneRef.current;
        const diff = targetX - lanePositionXRef.current;
        lanePositionXRef.current += diff * 0.22;
        tiltAngleRef.current = -diff * 0.38; // Dynamic motorcycle/skate tilt

        // 3. Jump Physics
        if (isJumpingRef.current) {
          jumpOffsetRef.current += jumpVelocityRef.current;
          jumpVelocityRef.current -= 0.88; // Smooth gravity
          if (jumpOffsetRef.current <= 0) {
            jumpOffsetRef.current = 0;
            isJumpingRef.current = false;
          }
        }

        // 4. Advance Overhead Arches
        ringArchesRef.current.forEach((arch) => {
          arch.z -= gameSpeedRef.current * 1.2;
          if (arch.z < 0) arch.z += 1.0;
        });

        // 5. Advance Gate (approaching player)
        gateZRef.current -= gameSpeedRef.current;
        setApproachProgress(Math.max(0, Math.min(1, 1 - gateZRef.current)));

        // 6. Shake Decay
        if (screenShakeRef.current > 0) {
          screenShakeRef.current *= 0.88;
          if (screenShakeRef.current < 0.2) screenShakeRef.current = 0;
        }

        // 7. Collision Check at Player Hit Zone
        if (gateZRef.current <= 0.08 && gateZRef.current > -0.05) {
          const ch = activeChallengeRef.current;
          if (ch) {
            const playerLaneRounded = Math.round(lanePositionXRef.current);
            const isCorrect = playerLaneRounded === ch.correctLane;

            if (isCorrect) {
              // SUCCESS!
              sound.playSuccess();
              setScore((prev) => {
                const newScore = prev + 10;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('subway_synonym_high_score', String(newScore));
                  }
                }
                return newScore;
              });

              setStreak((prev) => {
                const nextStreak = prev + 1;
                setMaxStreak((m) => Math.max(m, nextStreak));
                return nextStreak;
              });

              setWordsMastered((prev) => prev + 1);

              setSuccessToast({
                text: `${ch.targetWord} = ${ch.correctSynonym}!`,
                scoreGained: 10,
              });
              setTimeout(() => setSuccessToast(null), 2000);

              // Confetti & Shockwave burst
              createConfetti(width / 2, height * 0.65, 45);

              // Increase speed very gently (capped to preserve comfortable reading time)
              gameSpeedRef.current = Math.min(gameSpeedRef.current + 0.00006, 0.0048);

              // Spawn next challenge
              spawnNextChallenge();
            } else {
              // CRASH!
              sound.playError();
              screenShakeRef.current = 14;
              isGameOverRef.current = true;
              setLastMistake({
                target: ch.targetWord,
                correct: ch.correctSynonym,
                picked: ch.laneOptions[playerLaneRounded] || (isBn ? 'ভুল লেন' : 'WRONG LANE'),
              });
              setGameState('game_over');
            }
          }
        }
      }

      // --------------------------------------------------------
      // RENDER GRAPHICS
      // --------------------------------------------------------
      ctx.save();
      if (screenShakeRef.current > 0) {
        const sx = (Math.random() - 0.5) * screenShakeRef.current;
        const sy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(sx, sy);
      }

      ctx.clearRect(0, 0, width, height);

      // A. Deep Cyber Synthwave Night Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.38);
      skyGrad.addColorStop(0, '#030712'); // Deep space
      skyGrad.addColorStop(0.5, '#0B1528'); // Cyber midnight
      skyGrad.addColorStop(0.85, '#1E1B4B'); // Neon violet
      skyGrad.addColorStop(1, '#311042'); // Golden sunset horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.38);

      // Twinkling Stars
      starsRef.current.forEach((star) => {
        star.alpha += star.pulseSpeed;
        const currentAlpha = 0.3 + Math.abs(Math.sin(star.alpha)) * 0.6;
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Neon Skyline with Light Beams
      const horizonY = height * 0.36;
      const vanishingX = width / 2;

      // Scanning Light Beams in sky
      const beamAngle = Math.sin(runCycleRef.current * 0.3) * 0.3;
      ctx.save();
      ctx.translate(vanishingX, horizonY);
      ctx.rotate(beamAngle);
      const beamGrad = ctx.createLinearGradient(0, 0, 0, -height * 0.4);
      beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-45, -height * 0.35);
      ctx.lineTo(45, -height * 0.35);
      ctx.lineTo(15, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Distant City Skyline
      const bldgCount = 16;
      const bWidth = width / bldgCount;
      for (let i = 0; i < bldgCount; i++) {
        const bHeight = 30 + Math.sin(i * 137.5) * 22 + 15;
        const bx = i * bWidth;
        const by = horizonY - bHeight;

        // Silhouette
        ctx.fillStyle = '#091322';
        ctx.fillRect(bx, by, bWidth - 2, bHeight);

        // Lit Windows
        ctx.fillStyle = i % 3 === 0 ? '#38BDF8' : i % 2 === 0 ? '#FBBF24' : '#F43F5E';
        for (let wy = by + 5; wy < horizonY - 4; wy += 8) {
          if (Math.sin(i + wy) > 0.2) {
            ctx.fillRect(bx + 4, wy, 3, 4);
            ctx.fillRect(bx + bWidth - 8, wy, 3, 4);
          }
        }
      }

      // Neon Horizon Line
      ctx.strokeStyle = '#F59E0B';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // B. 3D Track Ground & Roadbed
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGrad.addColorStop(0, '#060F1D');
      groundGrad.addColorStop(0.3, '#0A182E');
      groundGrad.addColorStop(1, '#0E223D');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Track Perspective Dimensions (3 Lanes)
      const trackTopWidth = width * 0.24;
      const trackBottomWidth = width * 0.94;

      const trackTopLeft = vanishingX - trackTopWidth / 2;
      const trackTopRight = vanishingX + trackTopWidth / 2;
      const trackBottomLeft = vanishingX - trackBottomWidth / 2;
      const trackBottomRight = vanishingX + trackBottomWidth / 2;

      // Asphalt Surface
      ctx.beginPath();
      ctx.moveTo(trackTopLeft, horizonY);
      ctx.lineTo(trackTopRight, horizonY);
      ctx.lineTo(trackBottomRight, height);
      ctx.lineTo(trackBottomLeft, height);
      ctx.closePath();
      ctx.fillStyle = '#071322';
      ctx.fill();

      // Outer Neon Guardrails (Double rail with electric glow)
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#06B6D4';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 14;

      // Left Rail
      ctx.beginPath();
      ctx.moveTo(trackTopLeft, horizonY);
      ctx.lineTo(trackBottomLeft, height);
      ctx.stroke();

      // Right Rail
      ctx.beginPath();
      ctx.moveTo(trackTopRight, horizonY);
      ctx.lineTo(trackBottomRight, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // High-Speed Ground Sleepers (perspective rail ties)
      const numSleepers = 18;
      ctx.lineWidth = 2.5;
      for (let i = 0; i < numSleepers; i++) {
        const offset = (i / numSleepers + (trackScrollRef.current % 1)) % 1;
        const sleeperZ = Math.pow(offset, 2.3);
        const sy = horizonY + (height - horizonY) * sleeperZ;
        const sLeft = trackTopLeft + (trackBottomLeft - trackTopLeft) * sleeperZ;
        const sRight = trackTopRight + (trackBottomRight - trackTopRight) * sleeperZ;

        ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 + sleeperZ * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(sLeft, sy);
        ctx.lineTo(sRight, sy);
        ctx.stroke();
      }

      // Lane Divider Dashes (dividing Left, Mid, Right)
      for (let laneDiv = 1; laneDiv <= 2; laneDiv++) {
        const fraction = laneDiv / 3;
        const divTopX = trackTopLeft + trackTopWidth * fraction;
        const divBottomX = trackBottomLeft + trackBottomWidth * fraction;

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 3;
        ctx.setLineDash([14, 16]);
        ctx.lineDashOffset = -trackScrollRef.current * 20;

        ctx.beginPath();
        ctx.moveTo(divTopX, horizonY);
        ctx.lineTo(divBottomX, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      }

      // Ground Directional Arrows in each lane
      for (let lane = 0; lane < 3; lane++) {
        const fraction = (lane + 0.5) / 3;
        const arrowTopX = trackTopLeft + trackTopWidth * fraction;
        const arrowBottomX = trackBottomLeft + trackBottomWidth * fraction;

        for (let a = 0; a < 4; a++) {
          const aOffset = (a / 4 + (trackScrollRef.current * 0.5 % 1)) % 1;
          const aZ = Math.pow(aOffset, 2.0);
          if (aZ < 0.1) continue;

          const ay = horizonY + (height - horizonY) * aZ;
          const ax = arrowTopX + (arrowBottomX - arrowTopX) * aZ;
          const aSize = 14 * aZ;

          ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * aZ})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ax - aSize, ay + aSize * 0.6);
          ctx.lineTo(ax, ay);
          ctx.lineTo(ax + aSize, ay + aSize * 0.6);
          ctx.stroke();
        }
      }

      // Helper function to calculate perspective lane coordinates at a given depth Z (1.0 = far, 0.0 = player)
      const getLaneCenterAtZ = (laneIdx: number, z: number) => {
        const depth = Math.max(0, Math.min(1, 1 - z));
        const tWidth = trackTopWidth + (trackBottomWidth - trackTopWidth) * Math.pow(depth, 1.8);
        const tLeft = vanishingX - tWidth / 2;
        const laneWidth = tWidth / 3;
        const x = tLeft + laneWidth * (laneIdx + 0.5);
        const y = horizonY + (height - horizonY) * Math.pow(depth, 1.8);
        const scale = Math.pow(depth, 1.4);
        return { x, y, scale, laneWidth, depth };
      };

      // C. Overhead Cyber Ring Arches passing by (creates dynamic 3D depth)
      ringArchesRef.current.forEach((arch) => {
        const depth = Math.max(0, 1 - arch.z);
        if (depth < 0.05) return;
        const archScale = Math.pow(depth, 1.7);
        const aWidth = trackTopWidth + (trackBottomWidth - trackTopWidth) * archScale * 1.08;
        const aHeight = (height - horizonY) * archScale * 0.75;
        const ax = vanishingX;
        const ay = horizonY + (height - horizonY) * archScale;

        ctx.strokeStyle = `rgba(6, 182, 212, ${0.35 * depth})`;
        ctx.lineWidth = Math.max(2, 5 * archScale);
        ctx.beginPath();
        ctx.ellipse(ax, ay - aHeight * 0.5, aWidth / 2, aHeight * 0.65, 0, Math.PI, 0);
        ctx.stroke();
      });

      // --------------------------------------------------------
      // D. APPROACHING SYNONYM GATEWAYS (3 LANES)
      // --------------------------------------------------------
      const ch = activeChallengeRef.current;
      const gz = gateZRef.current;

      if (ch && gz > -0.15 && gz <= 1.0) {
        const gateDepth = Math.max(0, 1 - gz);
        const gateScale = Math.pow(gateDepth, 1.3); // Linear scaling so words are readable much earlier!
        const gateY = horizonY + (height - horizonY) * Math.pow(gateDepth, 1.8);

        for (let lane = 0; lane < 3; lane++) {
          const { x: gateX, laneWidth } = getLaneCenterAtZ(lane, gz);
          const optionText = ch.laneOptions[lane] || '';
          const isCorrectGate = lane === ch.correctLane;

          const cardWidth = Math.max(34, laneWidth * 0.9);
          const cardHeight = Math.max(22, cardWidth * 0.58);
          const archHeight = cardHeight * 1.6;

          ctx.save();
          ctx.translate(gateX, gateY);

          // 1. Futuristic Cyber Portal Pillars
          const pillarWidth = Math.max(3, 7 * gateScale);
          const pillarGrad = ctx.createLinearGradient(0, 0, 0, -archHeight);
          pillarGrad.addColorStop(0, '#0F172A');
          pillarGrad.addColorStop(0.5, isCorrectGate ? '#047857' : '#B45309');
          pillarGrad.addColorStop(1, isCorrectGate ? '#10B981' : '#F59E0B');

          // Left & Right Pillars
          ctx.fillStyle = pillarGrad;
          ctx.fillRect(-cardWidth / 2 - pillarWidth, -archHeight, pillarWidth, archHeight);
          ctx.fillRect(cardWidth / 2, -archHeight, pillarWidth, archHeight);

          // Glowing Neon Energy Ring between pillars
          ctx.strokeStyle = isCorrectGate ? '#10B981' : '#F59E0B';
          ctx.shadowColor = isCorrectGate ? '#34D399' : '#FBBF24';
          ctx.shadowBlur = Math.min(22, 16 * gateScale);
          ctx.lineWidth = Math.max(2.5, 5 * gateScale);

          ctx.beginPath();
          ctx.moveTo(-cardWidth / 2, -archHeight);
          ctx.lineTo(cardWidth / 2, -archHeight);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Hologram Light Curtain inside the gate
          const curtainGrad = ctx.createLinearGradient(0, -archHeight, 0, 0);
          curtainGrad.addColorStop(0, isCorrectGate ? 'rgba(16, 185, 129, 0.28)' : 'rgba(245, 158, 11, 0.22)');
          curtainGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = curtainGrad;
          ctx.fillRect(-cardWidth / 2, -archHeight, cardWidth, archHeight);

          // 2. High-Contrast Word Banner Board
          const cardX = -cardWidth / 2;
          const cardY = -archHeight - cardHeight * 0.55;
          const radius = Math.min(12, Math.max(4, 10 * gateScale));

          // Card Dark Obsidian Body
          ctx.fillStyle = '#020617';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius);
          } else {
            ctx.rect(cardX, cardY, cardWidth, cardHeight);
          }
          ctx.fill();

          // Card Neon Border
          ctx.strokeStyle = isCorrectGate ? '#34D399' : '#FBBF24';
          ctx.lineWidth = Math.max(2, 4 * gateScale);
          ctx.shadowColor = isCorrectGate ? '#10B981' : '#F59E0B';
          ctx.shadowBlur = Math.min(16, 12 * gateScale);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Lane Indicator Pill: [L], [M], [R]
          if (gateScale > 0.25) {
            const laneName = lane === 0 ? 'LANE 1 (LEFT)' : lane === 1 ? 'LANE 2 (MID)' : 'LANE 3 (RIGHT)';
            ctx.fillStyle = isCorrectGate ? '#6EE7B7' : '#FDE68A';
            ctx.font = `bold ${Math.max(9, Math.floor(10 * gateScale))}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(laneName, 0, cardY - 4);
          }

          // Option Text: Large, crisp, bold and legible from far away!
          const fontSize = Math.max(12, Math.floor(22 * Math.pow(gateDepth, 0.9)));
          ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 6;
          ctx.fillText(optionText, 0, cardY + cardHeight / 2);
          ctx.shadowBlur = 0;

          ctx.restore();
        }
      }

      // --------------------------------------------------------
      // E. UPGRADED ARTICULATED SUBWAY RUNNER CHARACTER
      // --------------------------------------------------------
      const playerLanePos = lanePositionXRef.current;
      const playerLaneClamped = Math.max(0, Math.min(2, playerLanePos));
      const playerDepth = 0.91;
      const pTrackWidth = trackTopWidth + (trackBottomWidth - trackTopWidth) * Math.pow(playerDepth, 1.8);
      const pTrackLeft = vanishingX - pTrackWidth / 2;
      const pLaneWidth = pTrackWidth / 3;

      const playerBaseX = pTrackLeft + pLaneWidth * (playerLaneClamped + 0.5);
      const playerBaseY = horizonY + (height - horizonY) * Math.pow(playerDepth, 1.8);
      const playerScale = 1.25;

      const currentY = playerBaseY - jumpOffsetRef.current;
      const isJumping = isJumpingRef.current;

      // Dust / Thruster sparks
      createRunnerTrail(playerBaseX, playerBaseY);

      ctx.save();
      ctx.translate(playerBaseX, currentY);
      // Banking tilt when steering left/right + slight forward sprint lean
      ctx.rotate(tiltAngleRef.current);
      ctx.scale(playerScale, playerScale);

      // 1. Realistic Dynamic Ground Shadow
      const shadowScale = Math.max(0.22, 1 - jumpOffsetRef.current / 110);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.55 * shadowScale})`;
      ctx.beginPath();
      ctx.ellipse(0, jumpOffsetRef.current, 24 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Sprint Kinematics (Articulated Walking & Running Cycle)
      const runAngle = runCycleRef.current;
      // Natural vertical bobbing when running (2 bobs per full stride)
      const bobY = isJumping ? 0 : Math.abs(Math.sin(runAngle)) * -4;
      const forwardLean = isJumping ? 0.04 : 0.12; // Athletic forward sprint lean

      // Leg Angles (Articulated Hip, Knee, and Ankle)
      const phaseL = runAngle;
      const phaseR = runAngle + Math.PI;

      // Left Leg
      const thighL = isJumping ? -0.42 : Math.sin(phaseL) * 0.65;
      // Knee bends backward when thigh swings back (heel kick toward glutes)
      const kneeL = isJumping
        ? 0.75
        : Math.sin(phaseL) < 0
        ? -Math.sin(phaseL) * 1.25 // Deep heel kick when pushing off
        : 0.18; // Slight flex when reaching forward
      const footL = isJumping ? 0.25 : Math.sin(phaseL) * 0.35 + 0.1;

      // Right Leg (opposite phase)
      const thighR = isJumping ? -0.42 : Math.sin(phaseR) * 0.65;
      const kneeR = isJumping
        ? 0.75
        : Math.sin(phaseR) < 0
        ? -Math.sin(phaseR) * 1.25
        : 0.18;
      const footR = isJumping ? 0.25 : Math.sin(phaseR) * 0.35 + 0.1;

      // Ground strike spark effect when foot plants
      if (!isJumping && Math.sin(phaseL) > 0.88 && Math.random() < 0.3) {
        particlesRef.current.push({
          x: playerBaseX - 8,
          y: playerBaseY + 2,
          vx: -1 + Math.random() * 2,
          vy: -1 - Math.random() * 2,
          color: '#F59E0B',
          size: 2.5,
          alpha: 0.9,
          life: 0,
          maxLife: 14,
          shape: 'spark',
        });
      }
      if (!isJumping && Math.sin(phaseR) > 0.88 && Math.random() < 0.3) {
        particlesRef.current.push({
          x: playerBaseX + 8,
          y: playerBaseY + 2,
          vx: -1 + Math.random() * 2,
          vy: -1 - Math.random() * 2,
          color: '#F59E0B',
          size: 2.5,
          alpha: 0.9,
          life: 0,
          maxLife: 14,
          shape: 'spark',
        });
      }

      // Helper to draw an articulated leg with thigh, knee, shin, and sneaker
      const renderLeg = (hipX: number, thighAngle: number, kneeAngle: number, footAngle: number, isLeft: boolean) => {
        ctx.save();
        ctx.translate(hipX, -22 + bobY);
        ctx.rotate(thighAngle);

        // A. Thigh (Joggers)
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-4, 0, 8, 13, 3);
        else ctx.fillRect(-4, 0, 8, 13);
        ctx.fill();

        // Cyber reflective jogger stripe
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(isLeft ? -4 : 2, 2, 2, 10);

        // B. Knee Joint & Shin
        ctx.translate(0, 12);
        ctx.rotate(kneeAngle);

        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-3.5, 0, 7, 13, 2.5);
        else ctx.fillRect(-3.5, 0, 7, 13);
        ctx.fill();

        // C. Ankle & Sneaker
        ctx.translate(0, 12);
        ctx.rotate(footAngle);

        // White sock cuff
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(-3, 0, 6, 3);

        // Cyan Streetwear Sneaker
        ctx.fillStyle = '#06B6D4';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-4.5, 2, 13, 7, 2.5);
        else ctx.fillRect(-4.5, 2, 13, 7);
        ctx.fill();

        // Toe cap detail
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(4, 3, 4, 5);

        // Glowing Amber Outsole
        ctx.fillStyle = '#F59E0B';
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 4;
        ctx.fillRect(-5, 8, 14, 2.5);
        ctx.shadowBlur = 0;

        ctx.restore();
      };

      // Render Both Articulated Legs
      renderLeg(-8, thighL, kneeL, footL, true);
      renderLeg(8, thighR, kneeR, footR, false);

      // 3. Torso, Hoodie & Jetpack with Athletic Sprint Lean
      ctx.save();
      ctx.translate(0, bobY);
      ctx.rotate(forwardLean);

      // Cyber Jetpack / Backpack with Twin Pulsing Thrusters
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-11, -50, 22, 22, 5);
      else ctx.fillRect(-11, -50, 22, 22);
      ctx.fill();

      // Jetpack Thruster Tubes
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(-10, -46, 5, 16);
      ctx.fillRect(5, -46, 5, 16);

      // Pulsing Cyan Thruster Flame Exhaust
      const thrusterGlow = 3 + Math.sin(runAngle * 4) * 2;
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = thrusterGlow * 2;
      ctx.beginPath();
      ctx.arc(-7.5, -28, thrusterGlow, 0, Math.PI * 2);
      ctx.arc(7.5, -28, thrusterGlow, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Streetwear Hoodie Body
      ctx.fillStyle = '#059669'; // Emerald sporty hoodie
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-14, -54, 28, 30, 7);
      else ctx.fillRect(-14, -54, 28, 30);
      ctx.fill();

      // Cyber Neon Chest/Back V-Stripe
      ctx.fillStyle = '#34D399';
      ctx.beginPath();
      ctx.moveTo(-5, -54);
      ctx.lineTo(5, -54);
      ctx.lineTo(0, -32);
      ctx.closePath();
      ctx.fill();

      // 4. Articulated Pumping Arms (Shoulder -> Bent Elbow -> Clenched Running Fist)
      const renderArm = (shoulderX: number, thighPhase: number, isLeft: boolean) => {
        ctx.save();
        ctx.translate(shoulderX, -48);
        // Counter-rhythm to leg stride
        const upperArmAngle = isJumping ? -0.4 : -thighPhase * 0.75;
        ctx.rotate(upperArmAngle);

        // Upper Arm (Hoodie Sleeve)
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-3.5, 0, 7, 12, 2.5);
        else ctx.fillRect(-3.5, 0, 7, 12);
        ctx.fill();

        // Elbow Joint bent forward (~75 degrees)
        ctx.translate(0, 11);
        ctx.rotate(isJumping ? 0.7 : 1.25);

        // Forearm
        ctx.fillStyle = '#059669';
        ctx.fillRect(-3, 0, 6, 11);

        // Running Fist
        ctx.fillStyle = '#FDE68A';
        ctx.beginPath();
        ctx.arc(0, 12, 3.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // Arms swing in counter-motion to legs
      renderArm(-14, thighL, true);
      renderArm(14, thighR, false);

      // 5. Head, Backward Cap & Headphones
      // Head
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.arc(0, -62, 10, 0, Math.PI * 2);
      ctx.fill();

      // Backward Amber Cap
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(0, -65, 10.5, Math.PI, 0);
      ctx.fill();
      // Cap Visor turned backward
      ctx.fillRect(-13, -66, 7.5, 3.5);

      // Neon Cyan DJ Headphones
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(-11, -62, 4.5, 0, Math.PI * 2);
      ctx.arc(11, -62, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(0, -66, 12, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      ctx.restore(); // Restore Torso & Forward Lean
      ctx.restore(); // Restore Player Transform

      // --------------------------------------------------------
      // F. PARTICLES (CONFETTI, SPARKS, FOUNTAINS)
      // --------------------------------------------------------
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'spark') {
          ctx.fillRect(p.x, p.y, p.size, p.size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore(); // Restore shake

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, spawnNextChallenge, highScore, isBn]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl flex flex-col select-none">
      {/* 1. TOP ARCADE HUD */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                {isBn ? 'সাবওয়ে সিনোনিম রানার' : 'Subway Synonym Runner'}
              </h2>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-xs">
                SWIPE GAME
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isBn
                ? 'সোয়াইপ করে সঠিক সিনোনিম গেটে প্রবেশ করুন (+১০ স্কোর)'
                : 'Swipe to steer into matching synonym gate (+10 pts)'}
            </p>
          </div>
        </div>

        {/* Score, High Score & Audio */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Score Counter */}
          <div className="bg-slate-800/90 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase leading-none">
                {isBn ? 'স্কোর' : 'SCORE'}
              </div>
              <div className="text-sm sm:text-base font-black text-amber-300 font-mono leading-none mt-0.5">
                {score}
              </div>
            </div>
          </div>

          {/* High Score */}
          <div className="hidden sm:flex bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-yellow-400" />
            <div>
              <div className="text-[9px] text-slate-400 font-bold uppercase leading-none">
                {isBn ? 'সেরা' : 'BEST'}
              </div>
              <div className="text-xs font-bold text-white font-mono leading-none mt-0.5">
                {highScore}
              </div>
            </div>
          </div>

          {/* Streak Flame */}
          {streak > 1 && (
            <div className="bg-rose-950/70 border border-rose-500/60 px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-rose-300 animate-pulse shadow-sm">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-xs font-black font-mono">{streak}x</span>
            </div>
          )}

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Pause / Resume */}
          {gameState === 'playing' && (
            <button
              onClick={() => {
                setIsPaused((prev) => {
                  isPausedRef.current = !prev;
                  return !prev;
                });
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* 2. TARGET SYNONYM PROMINENT HUD CARD (AMPLE TIME TO READ) */}
      {gameState === 'playing' && activeChallenge && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-lg pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl p-3 sm:p-4 shadow-2xl text-center relative overflow-hidden">
            {/* Approach Progress Bar along bottom of banner */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 transition-all duration-100"
                style={{ width: `${approachProgress * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-amber-400" />
                {isBn ? 'টার্গেট শব্দ' : 'TARGET VOCAB'}
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {isBn ? 'সঠিক সিনোনিম গেট বেছে নিন' : 'Steer into matching gate'}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow-md">
              "{activeChallenge.targetWord}"
            </div>

            <p className="text-xs sm:text-sm text-sky-200 font-bold mt-0.5">
              {isBn ? activeChallenge.targetMeaningBn : activeChallenge.targetMeaningEn}
            </p>
          </div>
        </div>
      )}

      {/* 3. SUCCESS POINT BADGE IN TOP-RIGHT (DOES NOT OBSTRUCT MIDDLE RUNWAY VIEW) */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="absolute top-16 sm:top-18 right-3 sm:right-6 z-30 pointer-events-none bg-slate-900/95 backdrop-blur-md border-2 border-emerald-400 text-white px-3.5 py-2 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
              +10
            </div>
            <div>
              <div className="text-xs font-black text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isBn ? 'সঠিক উত্তর!' : 'PERFECT!'}</span>
              </div>
              <div className="text-[10px] text-slate-300 font-semibold font-mono truncate max-w-[130px] sm:max-w-[170px]">
                {successToast.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CANVAS GAMING VIEW (NO BUTTONS, PURE SWIPE & DRAG) */}
      <div
        className="relative w-full h-[520px] sm:h-[620px] bg-slate-950 flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={620}
          className="w-full h-full object-cover block pointer-events-none"
        />

        {/* ELEGANT SWIPE & DRAG VISUAL HINT (Fades out automatically) */}
        {gameState === 'playing' && showSwipeHint && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-400/60 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
            <Hand className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              {isBn
                ? '👈 স্ক্রিনে বামে বা ডানে সোয়াইপ / ড্র্যাগ করুন 👉'
                : '👈 Swipe or Drag Left / Right to Steer • Up to Jump 👉'}
            </span>
          </div>
        )}

        {/* ON-SCREEN CURRENT LANE DOTS (VISUAL FEEDBACK) */}
        {gameState === 'playing' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700/50 backdrop-blur-xs">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                currentLaneUi === 0 ? 'bg-amber-400 scale-125 shadow-sm shadow-amber-400' : 'bg-slate-600'
              }`}
            />
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                currentLaneUi === 1 ? 'bg-amber-400 scale-125 shadow-sm shadow-amber-400' : 'bg-slate-600'
              }`}
            />
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                currentLaneUi === 2 ? 'bg-amber-400 scale-125 shadow-sm shadow-amber-400' : 'bg-slate-600'
              }`}
            />
          </div>
        )}

        {/* INTRO SCREEN OVERLAY */}
        {gameState === 'intro' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6 z-30">
            <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400/70 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25">
                <Gamepad2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isBn ? 'সাবওয়ে সিনোনিম রানার' : 'Subway Synonym Runner'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isBn
                    ? 'কোনো বোতামের প্রয়োজন নেই! মোবাইলে সোয়াইপ করুন অথবা মাউস ড্র্যাগ করে ৩টি লেনে দৌড়ে সঠিক সিনোনিম গেট বেছে নিন।'
                    : 'No buttons needed! Pure swipe game. Swipe or drag to steer your runner into matching synonym gates.'}
                </p>
              </div>

              {/* Rules & Highlights */}
              <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl text-left text-xs space-y-2 text-slate-200">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isBn ? 'প্রতিটি সঠিক সিনোনিমে: +১০ স্কোর' : 'Each correct synonym: +10 Score'}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <Hand className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isBn ? 'সোয়াইপ কন্ট্রোল: স্ক্রিনে আঙুল বা মাউস টেনে নিয়ন্ত্রণ করুন' : 'Swipe Controls: Swipe left/right on screen or drag mouse'}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? '২x সময়: শব্দ ও অপশন পড়ার জন্য দ্বিগুণ সময় বরাদ্দ' : '2X Time: Relaxed approach speed to read & decide comfortably'}</span>
                </div>
                <div className="flex items-center gap-2 text-rose-300 font-medium text-[11px]">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{isBn ? 'ভুল গেটে আঘাত লাগলে গেম ওভার হবে' : 'Crashing into a wrong gate ends the run'}</span>
                </div>
              </div>

              <button
                onClick={startNewGame}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isBn ? 'সোয়াইপ করে খেলা শুরু করুন' : 'Swipe & Play Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* PAUSE OVERLAY */}
        {isPaused && gameState === 'playing' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-30">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl max-w-xs w-full space-y-4">
              <h3 className="text-lg font-black text-white">
                {isBn ? 'গেম পজ করা হয়েছে' : 'Game Paused'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'খেলতে প্রস্তুত হলে রিজ্যুম চাপুন।' : 'Press resume when ready.'}
              </p>
              <button
                onClick={() => {
                  setIsPaused(false);
                  isPausedRef.current = false;
                }}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isBn ? 'পুনরায় শুরু করুন (Resume)' : 'Resume Game'}</span>
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameState === 'game_over' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 z-30 animate-in fade-in zoom-in-95 duration-200">
            <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isBn ? 'ক্র্যাশ! গেম ওভার' : 'CRASH! Game Over'}
                </h3>
                <p className="text-xs text-rose-300 mt-1 font-semibold">
                  {isBn ? 'আপনি ভুল সিনোনিম গেটে প্রবেশ করেছিলেন!' : 'You crashed into the wrong gate!'}
                </p>
              </div>

              {/* Mistake Explanation Card */}
              {lastMistake && (
                <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl text-left text-xs space-y-1.5">
                  <div className="text-slate-400 font-medium">
                    {isBn ? 'টার্গেট শব্দ ছিল:' : 'Target Word was:'}{' '}
                    <span className="text-white font-black">"{lastMistake.target}"</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {isBn ? 'সঠিক সিনোনিম:' : 'Correct Synonym:'} "{lastMistake.correct}"
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {isBn ? 'আপনার নির্বাচিত গেট:' : 'You steered into:'} "{lastMistake.picked}"
                    </span>
                  </div>
                </div>
              )}

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {isBn ? 'মোট স্কোর' : 'Final Score'}
                  </div>
                  <div className="text-lg font-black text-amber-300 font-mono mt-0.5">
                    {score}
                  </div>
                  <div className="text-[9px] text-slate-500">+10/word</div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {isBn ? 'শেখা শব্দ' : 'Words'}
                  </div>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {wordsMastered}
                  </div>
                  <div className="text-[9px] text-slate-500">IELTS Vocab</div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {isBn ? 'সেরা স্কোর' : 'Best Score'}
                  </div>
                  <div className="text-lg font-black text-yellow-300 font-mono mt-0.5">
                    {highScore}
                  </div>
                  <div className="text-[9px] text-slate-500">Personal Best</div>
                </div>
              </div>

              {/* Restart Button */}
              <div className="space-y-2">
                <button
                  onClick={startNewGame}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isBn ? 'আবার খেলুন (Restart Run)' : 'Restart the Game'}</span>
                </button>

                {isTrialExpired && onSubscribe && (
                  <button
                    onClick={onSubscribe}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-400/30 transition-colors cursor-pointer"
                  >
                    {isBn ? 'সাবস্ক্রিপশন প্ল্যান গ্রহণ করুন' : 'Upgrade to Full Plan'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
