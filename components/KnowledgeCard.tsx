import React, { useState } from 'react';
import type { KnowledgeContent, ExplanationMode } from '../types';
import { ActionMenu } from './ActionMenu';

interface KnowledgeCardProps {
  content: KnowledgeContent;
  isExiting: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onExplainRequest: (fact: string, mode: ExplanationMode) => void;
  onOpenComments: () => void;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ content, isExiting, isFavorite, onToggleFavorite, onExplainRequest, onOpenComments }) => {
  const [showCopied, setShowCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    const shareText = `Did you know? ${content.fact}\n\n${content.funnyCaption}`;
    const shareData = { title: 'Dopamine Drip!', text: shareText };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.error('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleFavoriteClick = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    onToggleFavorite();
  }

  return (
    <div className={`relative w-full h-[85%] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end ${isExiting ? 'animate-reel-out' : 'animate-reel-in'}`}>
      {content.mediaType === 'video' ? (
        <video 
            key={content.id}
            src={content.mediaUrl}
            className="absolute top-0 left-0 w-full h-full object-cover z-0" 
            autoPlay 
            loop 
            muted 
            playsInline 
        />
      ) : (
        <img src={content.mediaUrl} alt={content.funnyCaption} className="absolute top-0 left-0 w-full h-full object-cover z-0" />
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
      
      <div className="relative z-20 p-6 text-white space-y-4">
        {content.isUserGenerated && (
            <div className="text-sm font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm inline-block shadow-text">
                💧 Drip by {content.author || 'a user'}
            </div>
        )}
        <h2 className="text-2xl md:text-3xl font-bold leading-tight shadow-text">{content.funnyCaption}</h2>
        <p className="text-base md:text-lg font-medium bg-black/50 p-3 rounded-lg backdrop-blur-sm shadow-text"><strong>Did you know?</strong> {content.fact}</p>
      </div>

      <div className="absolute top-4 right-4 z-30 flex flex-col gap-4">
        <button onClick={handleShare} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-all duration-200" aria-label="Share">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
        </button>
        <button onClick={handleFavoriteClick} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-all duration-200" aria-label="Favorite">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
        </button>
         <button onClick={onOpenComments} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-all duration-200" aria-label="View comments">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
         <div className="relative">
            <button onClick={() => setMenuOpen(o => !o)} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-all duration-200" aria-label="More options">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
            {menuOpen && <ActionMenu onExplainRequest={(mode) => { onExplainRequest(content.fact, mode); setMenuOpen(false); }} />}
         </div>

        {showCopied && <div className="absolute top-16 -left-20 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg animate-fade-in-out">Copied!</div>}
      </div>

      <style>{`
        .shadow-text { text-shadow: 2px 2px 8px rgba(0,0,0,0.8); }
        @keyframes reel-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes reel-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-20px) scale(0.95); } }
        .animate-reel-in { animation: reel-in 0.4s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }
        .animate-reel-out { animation: reel-out 0.3s cubic-bezier(0.550, 0.055, 0.675, 0.190) forwards; }
        @keyframes fade-in-out { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        .animate-fade-in-out { animation: fade-in-out 2s ease-in-out forwards; }
      `}</style>
    </div>
  );
};