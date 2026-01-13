import React from 'react';
import { Tweet } from '../types';
import { Heart, Repeat, MessageCircle, Share } from 'lucide-react';

interface SocialFeedProps {
  tweets: Tweet[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ tweets }) => {
  return (
    <div className="h-full flex flex-col bg-black/40 border-l border-gray-800 backdrop-blur-md w-full max-w-sm">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-cyber font-bold tracking-wider text-white">LIVE FEED</h2>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {tweets.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 italic">Waiting for Aiko's first post...</div>
        ) : (
            tweets.slice().reverse().map((tweet) => (
            <div 
                key={tweet.id} 
                className={`bg-black/60 border ${tweet.isCursed ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-800'} rounded-lg p-4 animate-in fade-in slide-in-from-right-4 duration-500`}
            >
                <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex-shrink-0 overflow-hidden border border-pink-500">
                    <img src="https://picsum.photos/seed/aiko_idol_v1/200/200" alt="Aiko" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">Aiko ✨</span>
                    <span className="text-gray-500 text-sm truncate">@aiko_real_idol</span>
                    </div>
                    <p className="text-gray-200 mt-1 text-sm leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
                    
                    <div className="flex items-center justify-between mt-3 text-gray-500 text-xs">
                    <button className="flex items-center gap-1 hover:text-blue-400 transition-colors"><MessageCircle size={14} /> 24</button>
                    <button className="flex items-center gap-1 hover:text-green-400 transition-colors"><Repeat size={14} /> {tweet.retweets}</button>
                    <button className="flex items-center gap-1 hover:text-pink-500 transition-colors"><Heart size={14} /> {tweet.likes}</button>
                    <button className="hover:text-blue-400 transition-colors"><Share size={14} /></button>
                    </div>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SocialFeed;