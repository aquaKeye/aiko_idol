import React from 'react';

interface ApprovalBarProps {
  rating: number;
}

const ApprovalBar: React.FC<ApprovalBarProps> = ({ rating }) => {
  // Determine color based on rating
  let barColor = 'bg-pink-500';
  let statusText = 'IDOL SUPERSTAR';
  let glowColor = 'shadow-pink-500/50';

  if (rating < 30) {
    barColor = 'bg-red-600';
    statusText = 'CANCELLATION IMMINENT';
    glowColor = 'shadow-red-600/50';
  } else if (rating < 60) {
    barColor = 'bg-yellow-500';
    statusText = 'CONTROVERSIAL';
    glowColor = 'shadow-yellow-500/50';
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-2">
      <div className="flex justify-between items-end mb-1 px-2">
        <span className="font-cyber text-xs text-gray-400">APPROVAL RATING</span>
        <span className={`font-cyber font-bold ${rating < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {statusText}
        </span>
        <span className="font-mono text-xl font-bold">{rating}%</span>
      </div>
      
      <div className={`h-6 bg-gray-900 rounded-full border border-gray-700 relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] ${rating < 30 ? 'animate-pulse-red' : ''}`}>
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '20px 100%' }}>
        </div>
        
        {/* The Bar */}
        <div 
          className={`h-full ${barColor} transition-all duration-1000 ease-out relative`}
          style={{ width: `${rating}%` }}
        >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalBar;