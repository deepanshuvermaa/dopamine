import React, { useState } from 'react';
import type { KnowledgeContent, UserProfile, UnlockedAchievement, Achievement } from '../types';
import { ALL_ACHIEVEMENTS } from '../services/achievementsService';

interface ProfileScreenProps {
  profile: UserProfile;
  favorites: KnowledgeContent[];
  unlockedAchievements: UnlockedAchievement[];
  onBack: () => void;
  onToggleFavorite: (content: KnowledgeContent) => void;
  onUsernameChange: (newName: string) => void;
}

const StatCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-cyan-400">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg">
        <div className="text-4xl">{achievement.icon}</div>
        <div>
            <p className="font-bold">{achievement.title}</p>
            <p className="text-sm text-gray-400">{achievement.description}</p>
        </div>
    </div>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, favorites, unlockedAchievements, onBack, onToggleFavorite, onUsernameChange }) => {
    const [activeTab, setActiveTab] = useState<'stats' | 'favorites'>('stats');
    const [isEditingName, setIsEditingName] = useState(false);
    const [username, setUsername] = useState(profile.username);
    
    const unlockedAchievementDetails = unlockedAchievements
        .map(ua => ALL_ACHIEVEMENTS.find(a => a.id === ua.achievementId))
        .filter((a): a is Achievement => a !== undefined)
        .reverse();

    const handleUsernameSave = () => {
        if(username.trim().length > 2) {
            onUsernameChange(username.trim());
            setIsEditingName(false);
        }
    };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in">
      <header className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-center flex-grow">Your Profile</h2>
        <div className="w-8"></div>
      </header>

      {/* Profile Header */}
      <div className="p-4 flex flex-col items-center gap-2 border-b border-gray-700">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-4xl font-bold">
            {profile.username.charAt(0).toUpperCase()}
        </div>
        {isEditingName ? (
            <div className="flex items-center gap-2 mt-2">
                 <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    className="bg-gray-800 text-center text-xl font-bold rounded-lg px-2 py-1"
                    autoFocus
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleUsernameSave()}
                 />
                 <button onClick={handleUsernameSave} className="text-green-400 disabled:text-gray-500" disabled={username.trim().length < 3}>Save</button>
            </div>
        ) : (
             <div className="flex items-center gap-2 mt-2">
                <h3 className="text-2xl font-bold">{profile.username}</h3>
                <button onClick={() => setIsEditingName(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                </button>
             </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
          <button onClick={() => setActiveTab('stats')} className={`flex-1 py-3 font-bold ${activeTab === 'stats' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Stats & Achievements</button>
          <button onClick={() => setActiveTab('favorites')} className={`flex-1 py-3 font-bold ${activeTab === 'favorites' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Favorites ({favorites.length})</button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {activeTab === 'stats' ? (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Drips Viewed" value={profile.dripsViewed} />
                    <StatCard label="Favorites Saved" value={profile.favoritesSaved} />
                    <StatCard label="Comments Made" value={profile.commentsMade} />
                    <StatCard label="Drips Created" value={profile.dripsCreated} />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Achievements</h4>
                    <div className="space-y-3">
                    {unlockedAchievementDetails.length > 0 ? (
                        unlockedAchievementDetails.map(ach => <AchievementBadge key={ach.id} achievement={ach} />)
                    ) : (
                        <p className="text-gray-500 text-center py-4">Keep exploring to unlock achievements!</p>
                    )}
                    </div>
                </div>
            </div>
        ) : (
             <div className="space-y-4">
              {favorites.length > 0 ? (
                  favorites.slice().reverse().map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-3 flex gap-4 items-center">
                      {item.mediaType === 'video' ? (
                        <video src={item.mediaUrl} className="w-16 h-16 rounded-md object-cover flex-shrink-0" muted playsInline />
                      ) : (
                        <img src={item.mediaUrl} alt={item.funnyCaption} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                      )}
                      <div className="flex-grow">
                        <p className="text-sm font-semibold text-gray-300">{item.fact}</p>
                      </div>
                      <button onClick={() => onToggleFavorite(item)} className="p-2 text-red-400 hover:text-red-300" aria-label="Remove from favorites">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 pt-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                  <h3 className="text-xl font-bold">No Favorites Yet</h3>
                  <p>Tap the heart on a drip to save it here.</p>
                </div>
              )}
            </div>
        )}
      </div>

       <style>{`
            @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
            }
            .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};