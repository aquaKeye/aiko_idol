import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Activity, Users, AlertTriangle, Play, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import AikoAvatar from './components/AikoAvatar';
import ChatInterface from './components/ChatInterface';
import SocialFeed from './components/SocialFeed';
import ApprovalBar from './components/ApprovalBar';
import { ChatMessage, Tweet, GameState, AikoEmotion } from './types';
import { generateAikoResponse, generateApology, generateAikoAvatar } from './services/gemini';
import { INITIAL_APPROVAL_RATING, WELCOME_MESSAGE, STORAGE_KEY_AVATAR } from './constants';

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.Lobby);
  const [approvalRating, setApprovalRating] = useState(INITIAL_APPROVAL_RATING);
  
  // Data State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  
  // Aiko State
  const [aikoEmotion, setAikoEmotion] = useState<AikoEmotion>(AikoEmotion.Happy);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // Load avatar from storage on mount
  useEffect(() => {
      const stored = localStorage.getItem(STORAGE_KEY_AVATAR);
      if (stored) {
          setAvatarUrl(stored);
      }
  }, []);
  
  const handleStartStream = async () => {
    // Only generate if we don't have one
    if (!avatarUrl) {
        setIsGeneratingAvatar(true);
        const generatedUrl = await generateAikoAvatar();
        setIsGeneratingAvatar(false);

        if (generatedUrl) {
            setAvatarUrl(generatedUrl);
            try {
                localStorage.setItem(STORAGE_KEY_AVATAR, generatedUrl);
            } catch (e) {
                console.warn("Storage full, could not save avatar");
            }
        } else {
            setAvatarUrl("https://img.freepik.com/free-photo/anime-style-character-space_23-2151133939.jpg"); 
        }
    }

    setGameState(GameState.Live);
    setMessages([{ 
        id: 'system-1', 
        user: 'System', 
        text: WELCOME_MESSAGE, 
        timestamp: Date.now(), 
        isSystem: true 
    }]);
    
    setTweets([{
        id: 'tweet-init',
        author: 'Aiko',
        handle: '@aiko_real_idol',
        content: "HELLO EVERYONE! ✨ I'm finally live! I'm so excited to talk to all my fans! Please be nice! 💖 #debut #idol",
        likes: 1240,
        retweets: 530,
        timestamp: Date.now(),
        isCursed: false
    }]);
  };

  const handleResetAvatar = () => {
      localStorage.removeItem(STORAGE_KEY_AVATAR);
      setAvatarUrl(undefined);
  };

  const handleUserMessage = useCallback(async (text: string) => {
    if (gameState !== GameState.Live || isProcessing) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user: `Viewer${Math.floor(Math.random() * 9000) + 1000}`,
      text: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    setIsProcessing(true);
    setAikoEmotion(AikoEmotion.Neutral); // Thinking face?

    // Call Gemini
    const response = await generateAikoResponse(text, approvalRating);

    // Process Response
    setIsProcessing(false);
    
    // Simulate talking duration
    setIsTalking(true);
    setTimeout(() => setIsTalking(false), Math.min(3000, response.tweet.length * 50));

    setAikoEmotion(response.mood);

    // Calculate Rating Impact
    let ratingChange = 0;
    let isCursed = false;

    if (response.cancel_score > 20) {
        // Damage formula
        const damage = Math.floor((response.cancel_score - 20) * 0.5); 
        ratingChange = -damage;
        isCursed = response.cancel_score > 50;
    } else {
        // Small heal
        ratingChange = 2;
    }

    // Update Rating
    setApprovalRating(prev => {
        const newVal = Math.max(0, Math.min(100, prev + ratingChange));
        if (newVal === 0) {
             setTimeout(() => handleGameOver(), 1000);
        }
        return newVal;
    });

    // Post Tweet
    const newTweet: Tweet = {
        id: `tweet-${Date.now()}`,
        author: 'Aiko',
        handle: '@aiko_real_idol',
        content: response.tweet,
        likes: isCursed ? 42 : Math.floor(Math.random() * 500) + 100,
        retweets: isCursed ? 5000 : Math.floor(Math.random() * 200) + 50,
        timestamp: Date.now(),
        isCursed: isCursed
    };
    setTweets(prev => [...prev, newTweet]);

  }, [gameState, approvalRating, isProcessing]);


  const handleGameOver = async () => {
      setGameState(GameState.Cancelled);
      setAikoEmotion(AikoEmotion.Crying);
      
      // Clear avatar on game over (per game lore: "Project Death")
      localStorage.removeItem(STORAGE_KEY_AVATAR);

      setTweets(prev => [...prev, {
          id: 'system-cancel',
          author: 'System',
          handle: '@sys_admin',
          content: "⚠️ ACCOUNT SUSPENDED FOR VIOLATING COMMUNITY GUIDELINES.",
          likes: 0,
          retweets: 99999,
          timestamp: Date.now(),
          isCursed: true
      }]);
      
      const apology = await generateApology();
      setTweets(prev => [...prev, {
        id: 'tweet-apology',
        author: 'Aiko',
        handle: '@aiko_real_idol',
        content: apology,
        likes: 0,
        retweets: 0,
        timestamp: Date.now(),
        isCursed: true
    }]);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden relative">
      {/* Scanline Overlay */}
      <div className="scanlines"></div>

      {/* Lobby / Start Screen */}
      {gameState === GameState.Lobby && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
          <h1 className="text-6xl md:text-8xl font-cyber text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4 glow-text">
            AIKO
          </h1>
          <p className="text-xl md:text-2xl text-pink-200 mb-8 font-light tracking-wide">
            THE UNCANCELABLE IDOL
          </p>
          
          <div className="relative group">
               {avatarUrl && (
                   <div className="mb-4">
                       <p className="text-xs text-gray-500 mb-1">CURRENT MODEL LOADED FROM STORAGE</p>
                       <img src={avatarUrl} className="w-32 h-32 rounded-full border-2 border-pink-500 mx-auto object-cover opacity-80" />
                       <button onClick={handleResetAvatar} className="mt-2 text-xs text-red-500 hover:text-red-400 flex items-center gap-1 mx-auto">
                           <Trash2 size={12}/> DELETE MODEL
                       </button>
                   </div>
               )}

              <button 
                onClick={handleStartStream}
                disabled={isGeneratingAvatar}
                className="group relative px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xl rounded-none clip-path-polygon transition-all duration-300 transform hover:scale-105 disabled:bg-pink-900 disabled:cursor-wait"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
              >
                <span className="flex items-center gap-3">
                  {isGeneratingAvatar ? (
                      <><Sparkles className="animate-spin" /> GENERATING NEW IDOL...</>
                  ) : avatarUrl ? (
                      <><Play className="fill-current" /> RESUME BROADCAST</>
                  ) : (
                      <><RefreshCw className="fill-current" /> GENERATE & START</>
                  )}
                </span>
              </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === GameState.Cancelled && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
           <div className="bg-red-900/90 border-4 border-red-600 p-12 max-w-2xl text-center transform rotate-3 animate-in zoom-in duration-500 backdrop-blur-md shadow-[0_0_100px_rgba(220,38,38,0.5)] pointer-events-auto">
               <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-6 animate-bounce" />
               <h2 className="text-5xl font-cyber font-bold text-white mb-2">CANCELLED</h2>
               <p className="text-red-200 text-xl font-mono mb-8">APPROVAL RATING HIT 0%</p>
               <p className="text-white italic opacity-80 mb-8">"I didn't mean it... I just wanted to be a star..."</p>
               <button 
                 onClick={() => window.location.reload()}
                 className="bg-white text-red-900 font-bold px-6 py-3 hover:bg-gray-200 transition-colors"
               >
                 TRY AGAIN
               </button>
           </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row h-full max-w-[1920px] mx-auto w-full">
        
        {/* Left/Center Area: Avatar & Stats */}
        <div className="flex-1 flex flex-col relative p-4">
            
            {/* Top Bar Stats */}
            <div className="h-24 w-full z-10">
                <ApprovalBar rating={approvalRating} />
                <div className="flex justify-between items-center text-xs text-pink-300 font-mono mt-2 px-2">
                    <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full ${gameState === GameState.Live ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                         {gameState === GameState.Live ? 'LIVE' : 'OFFLINE'}
                         <span className="ml-4 flex items-center gap-1 text-gray-400"><Users size={12}/> 12,402 Viewers</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Activity size={12}/> BITRATE: 6000kbps
                    </div>
                </div>
            </div>

            {/* Avatar Viewport */}
            <div className="flex-1 relative flex items-center justify-center min-h-0 my-4">
                <AikoAvatar emotion={aikoEmotion} isTalking={isTalking} imageUrl={avatarUrl} />
            </div>

            {/* Bottom Chat */}
            <div className="h-48 md:h-64 w-full">
                <ChatInterface 
                    messages={messages} 
                    onSendMessage={handleUserMessage} 
                    disabled={gameState !== GameState.Live} 
                />
            </div>
        </div>

        {/* Right Area: Social Feed */}
        <div className="hidden md:block w-96 h-full border-l border-gray-800">
            <SocialFeed tweets={tweets} />
        </div>
      </div>
    </div>
  );
};

export default App;