import React from 'react';
import { AikoEmotion } from '../types';

interface AikoAvatarProps {
  emotion: AikoEmotion;
  isTalking: boolean;
  imageUrl?: string;
}

const AikoAvatar: React.FC<AikoAvatarProps> = ({ emotion, isTalking, imageUrl }) => {

  const finalImageUrl = imageUrl || "https://picsum.photos/seed/aiko_idol_v1/800/800";

  // --- ANIME "MANPU" (Visual Symbols) RENDERERS ---

  // 1. Blush Lines (Vertical pink lines for cheeks)
  const BlushOverlay = () => (
    <div className="absolute top-[45%] left-0 w-full flex justify-between px-24 pointer-events-none opacity-90 z-20">
       <div className="flex space-x-1">
          <div className="w-1 h-6 bg-pink-500 -rotate-12 rounded-full"></div>
          <div className="w-1 h-6 bg-pink-500 -rotate-12 rounded-full mt-1"></div>
          <div className="w-1 h-6 bg-pink-500 -rotate-12 rounded-full"></div>
       </div>
       <div className="flex space-x-1">
          <div className="w-1 h-6 bg-pink-500 rotate-12 rounded-full"></div>
          <div className="w-1 h-6 bg-pink-500 rotate-12 rounded-full mt-1"></div>
          <div className="w-1 h-6 bg-pink-500 rotate-12 rounded-full"></div>
       </div>
    </div>
  );

  // 2. Heavy Gloom Shadow (Blue/Purple gradient from top)
  const GloomOverlay = () => (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-transparent to-transparent z-20 mix-blend-multiply pointer-events-none"></div>
  );

  // 3. Comic Tears (Streaming streams)
  const TearsOverlay = () => (
    <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Left Stream */}
        <div className="absolute top-[48%] left-[35%] w-4 h-32 bg-cyan-300 opacity-80 rounded-b-full animate-tear-stream border-x-2 border-white/50"></div>
        {/* Right Stream */}
        <div className="absolute top-[48%] right-[35%] w-4 h-32 bg-cyan-300 opacity-80 rounded-b-full animate-tear-stream border-x-2 border-white/50" style={{ animationDelay: '0.2s'}}></div>
        
        {/* Flying droplets */}
        <div className="absolute top-1/2 left-10 text-cyan-300 text-4xl animate-bounce">💧</div>
        <div className="absolute top-1/2 right-10 text-cyan-300 text-4xl animate-bounce" style={{ animationDelay: '0.3s'}}>💧</div>
    </div>
  );

  // 4. Shock Lines (Impact Frame)
  const ShockOverlay = () => (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        {/* Radial lines */}
        <div className="absolute inset-[-50%] bg-[repeating-conic-gradient(rgba(255,255,255,0.1)_0deg_5deg,transparent_5deg_15deg)] animate-spin-slow"></div>
        {/* Pale face filter */}
        <div className="absolute inset-0 bg-blue-100/30 mix-blend-hue"></div>
    </div>
  );

  // 5. Question Marks
  const ConfusionOverlay = () => (
    <div className="absolute top-10 right-10 z-30 animate-bounce">
       <span className="text-6xl font-bold text-pink-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">?</span>
       <span className="text-4xl font-bold text-pink-300 absolute -right-6 top-8">?</span>
    </div>
  );

  // 6. Sparkles/Stars
  const SparklesOverlay = () => (
      <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-[35%] left-[28%] text-yellow-300 text-5xl animate-pulse drop-shadow-md">✨</div>
          <div className="absolute top-[35%] right-[28%] text-yellow-300 text-5xl animate-pulse drop-shadow-md" style={{animationDelay: '0.5s'}}>✨</div>
      </div>
  );

  // 7. Anger Vein
  const AngerOverlay = () => (
      <div className="absolute top-16 right-16 z-30 pointer-events-none">
          <svg width="60" height="60" viewBox="0 0 100 100" className="animate-pulse">
              <path d="M20,50 Q40,20 50,50 T80,50 M50,20 V80 M20,50 H80" stroke="red" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
      </div>
  );

  // --- CONTAINER LOGIC ---

  const getContainerClasses = () => {
      let base = `relative w-[400px] h-[400px] transition-all duration-300 transform `;
      
      // Talking bounce
      if (isTalking) base += 'scale-[1.03] ';
      
      switch (emotion) {
          case AikoEmotion.Shocked: return base + 'translate-y-2 grayscale contrast-125'; // Pale with shock
          case AikoEmotion.Excited: return base + 'scale-110'; // Zoom in excitement
          case AikoEmotion.Crying: return base + 'translate-y-4 brightness-75'; // Head down, dark
          case AikoEmotion.Confused: return base + 'rotate-3'; // Head tilt
          case AikoEmotion.Sad: return base + 'grayscale-[0.5] brightness-90';
          default: return base;
      }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-900 rounded-xl border border-pink-500/30 group">
      
      {/* Background Ambience (Changes color with mood) */}
      <div className={`absolute inset-0 bg-cover bg-center opacity-40 blur-xl transition-colors duration-1000
          ${emotion === AikoEmotion.Crying ? 'bg-blue-900' : ''}
          ${emotion === AikoEmotion.Shocked ? 'bg-white' : ''}
          ${emotion === AikoEmotion.Excited ? 'bg-yellow-500' : ''}
          `} 
           style={{ backgroundImage: `url(${finalImageUrl})` }}>
      </div>
      
      {/* --- AVATAR COMPONENT --- */}
      <div className={getContainerClasses()}>
         
         {/* Base Image */}
         <img 
            src={finalImageUrl} 
            alt="Aiko Avatar" 
            className="w-full h-full object-cover rounded-full border-4 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.4)] relative z-10"
         />

         {/* --- EMOTION LAYERS --- */}
         
         {/* HAPPY / EXCITED */}
         {(emotion === AikoEmotion.Happy || emotion === AikoEmotion.Excited) && (
             <>
                <BlushOverlay />
                {emotion === AikoEmotion.Excited && <SparklesOverlay />}
             </>
         )}

         {/* CRYING / SAD */}
         {(emotion === AikoEmotion.Crying || emotion === AikoEmotion.Sad) && (
             <>
                 <GloomOverlay />
                 {emotion === AikoEmotion.Crying && <TearsOverlay />}
             </>
         )}

         {/* SHOCKED */}
         {emotion === AikoEmotion.Shocked && (
             <ShockOverlay />
         )}
         
         {/* CONFUSED */}
         {emotion === AikoEmotion.Confused && (
            <ConfusionOverlay />
         )}

         {/* Talking Mouth Overlay (Simple Animation to simulate lip sync on static image) */}
         {isTalking && (
             <div className="absolute bottom-[28%] left-1/2 transform -translate-x-1/2 z-20">
                 {/* Rapidly changing mouth shape */}
                 <div className="w-8 h-4 bg-pink-900/80 rounded-full animate-talking-mouth border border-pink-300"></div>
             </div>
         )}
      </div>

      {/* Tech Info */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-pink-500/50 text-xs font-mono text-pink-400 z-40">
        MODEL: AIKO-V3 [CEL-SHADE]<br/>
        SYNC: {isTalking ? 'ON' : 'OFF'}<br/>
        MOOD: {emotion.toUpperCase()}
      </div>

      <style>{`
        @keyframes tear-stream {
            0% { height: 0; opacity: 0; }
            50% { height: 60px; opacity: 1; }
            100% { height: 120px; opacity: 0; transform: translateY(20px); }
        }
        .animate-tear-stream {
            animation: tear-stream 1.5s infinite linear;
        }
        @keyframes talking-mouth {
            0% { transform: scaleY(0.2); }
            50% { transform: scaleY(1); }
            100% { transform: scaleY(0.2); }
        }
        .animate-talking-mouth {
            animation: talking-mouth 0.2s infinite;
        }
        .animate-spin-slow {
            animation: spin 10s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AikoAvatar;