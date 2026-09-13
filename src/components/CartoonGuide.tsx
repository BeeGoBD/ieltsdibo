import React from 'react';
import { motion } from 'motion/react';

export type MascotPose = 'pointing-scores' | 'pointing-down' | 'happy-celebrate' | 'thinking' | 'waving';

interface CartoonGuideProps {
  pose: MascotPose;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CartoonGuide: React.FC<CartoonGuideProps> = ({
  pose,
  message,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="mb-2 max-w-[200px] bg-white border-2 border-slate-900 px-3 py-1.5 rounded-2xl shadow-[3px_3px_0px_#0A2540] text-xs font-semibold text-slate-800 text-center relative"
        >
          {message}
          {/* Bubble triangle tip */}
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900"></div>
          <div className="absolute -bottom-[6px] right-[25px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white"></div>
        </motion.div>
      )}

      {/* Mascot SVG Vector Illustration */}
      <motion.div
        animate={{
          y: [0, -4, 0],
          rotate: pose === 'happy-celebrate' ? [-2, 2, -2] : [0, 0.5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className={`${sizeClasses[size]} relative drop-shadow-md`}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F0F9FF" />
            </linearGradient>
            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A2540" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          {/* Shadow beneath character */}
          <ellipse cx="80" cy="148" rx="42" ry="7" fill="#0A2540" opacity="0.15" />

          {/* Feet */}
          <ellipse cx="64" cy="142" rx="11" ry="6" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
          <ellipse cx="96" cy="142" rx="11" ry="6" fill="#F97316" stroke="#C2410C" strokeWidth="2" />

          {/* Main Owl/Mascot Body */}
          <ellipse
            cx="80"
            cy="88"
            rx="46"
            ry="52"
            fill="url(#bodyGrad)"
            stroke="#0369A1"
            strokeWidth="3.5"
          />

          {/* Belly Patch */}
          <ellipse
            cx="80"
            cy="98"
            rx="32"
            ry="38"
            fill="url(#bellyGrad)"
            stroke="#BAE6FD"
            strokeWidth="2"
          />

          {/* Belly Feather Details */}
          <path d="M72 90 Q80 96 88 90" stroke="#7DD3FC" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M66 102 Q80 110 94 102" stroke="#7DD3FC" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M74 114 Q80 120 86 114" stroke="#7DD3FC" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Cheeks Blush */}
          <ellipse cx="48" cy="85" rx="7" ry="4" fill="#FDA4AF" opacity="0.8" />
          <ellipse cx="112" cy="85" rx="7" ry="4" fill="#FDA4AF" opacity="0.8" />

          {/* Eyes depending on pose */}
          {pose === 'happy-celebrate' ? (
            <>
              {/* Happy closed eyes (inverted curves) */}
              <path d="M48 74 Q58 64 68 74" stroke="#0A2540" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M92 74 Q102 64 112 74" stroke="#0A2540" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Big, cute round open eyes */}
              <circle cx="58" cy="72" r="14" fill="#FFFFFF" stroke="#0A2540" strokeWidth="3" />
              <circle cx="102" cy="72" r="14" fill="#FFFFFF" stroke="#0A2540" strokeWidth="3" />

              {/* Pupils with sparkles */}
              <ellipse cx={pose === 'pointing-scores' ? '54' : '58'} cy={pose === 'pointing-down' ? '76' : '72'} rx="8" ry="8" fill="#0A2540" />
              <ellipse cx={pose === 'pointing-scores' ? '98' : '102'} cy={pose === 'pointing-down' ? '76' : '72'} rx="8" ry="8" fill="#0A2540" />

              {/* Eye Catchlights / Sparkles */}
              <circle cx={pose === 'pointing-scores' ? '52' : '56'} cy={pose === 'pointing-down' ? '73' : '69'} r="3" fill="#FFFFFF" />
              <circle cx={pose === 'pointing-scores' ? '96' : '100'} cy={pose === 'pointing-down' ? '73' : '69'} r="3" fill="#FFFFFF" />
            </>
          )}

          {/* Beak / Smile */}
          <polygon
            points="80,78 88,87 72,87"
            fill="url(#beakGrad)"
            stroke="#C2410C"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Arms / Wings & Poses */}
          {pose === 'pointing-scores' && (
            <>
              {/* Right resting wing */}
              <path
                d="M124 88 Q135 105 122 120 Q112 110 118 92 Z"
                fill="#0284C7"
                stroke="#0369A1"
                strokeWidth="3"
              />
              {/* Left wing extended, pointing up-left toward score cards */}
              <g className="origin-right">
                <path
                  d="M40 85 Q10 65 2 40 Q8 32 18 36 Q28 48 42 75 Z"
                  fill="#38BDF8"
                  stroke="#0284C7"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Pointing index finger tip */}
                <ellipse cx="2" cy="38" rx="6" ry="4" transform="rotate(-30 2 38)" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
              </g>
            </>
          )}

          {pose === 'pointing-down' && (
            <>
              {/* Both wings or left wing pointing down towards weakness options */}
              <path
                d="M38 88 Q18 105 24 135 Q34 138 42 125 Q46 105 44 88 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M122 88 Q142 105 136 135 Q126 138 118 125 Q114 105 116 88 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Pointing down tips */}
              <ellipse cx="24" cy="138" rx="5" ry="5" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
              <ellipse cx="136" cy="138" rx="5" ry="5" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            </>
          )}

          {pose === 'happy-celebrate' && (
            <>
              {/* Both wings raised up in celebration */}
              <path
                d="M38 82 Q12 55 18 32 Q28 28 36 42 Q46 62 44 84 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M122 82 Q148 55 142 32 Q132 28 124 42 Q114 62 116 84 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Celebration sparkles */}
              <circle cx="20" cy="20" r="3" fill="#F59E0B" />
              <circle cx="140" cy="20" r="3" fill="#F59E0B" />
              <path d="M14 10 L18 14 M18 10 L14 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M136 10 L140 14 M140 10 L136 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {(pose === 'waving' || pose === 'thinking') && (
            <>
              {/* Right wing waving */}
              <path
                d="M122 82 Q144 65 142 42 Q132 40 125 54 Q116 70 118 84 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Left wing relaxed */}
              <path
                d="M36 88 Q24 105 35 122 Q45 112 40 92 Z"
                fill="#0284C7"
                stroke="#0369A1"
                strokeWidth="3"
              />
            </>
          )}

          {/* Scholar Graduation Cap / Mortarboard */}
          <g transform="translate(0, -6)">
            {/* Cap Base */}
            <path d="M60 44 C60 38 100 38 100 44 L96 52 C96 54 64 54 64 52 Z" fill="#0A2540" />
            {/* Diamond top */}
            <polygon
              points="80,24 122,38 80,48 38,38"
              fill="url(#capGrad)"
              stroke="#0A2540"
              strokeWidth="2.5"
            />
            {/* Center button */}
            <circle cx="80" cy="36" r="3.5" fill="#F59E0B" />
            {/* Tassel */}
            <path d="M80 36 Q98 42 108 55" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="105" y="54" width="6" height="10" rx="1.5" fill="#EA580C" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
