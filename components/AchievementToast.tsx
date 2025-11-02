import React from 'react';
import type { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black p-3 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-toast-in-out">
        <div className="text-3xl flex-shrink-0">{achievement.icon}</div>
        <div className="flex-grow">
            <p className="font-bold text-sm">Achievement Unlocked!</p>
            <p className="text-xs">{achievement.title}</p>
        </div>
        <style>{`
            @keyframes toast-in-out {
                0% { transform: translate(-50%, -150%); opacity: 0; }
                15% { transform: translate(-50%, 0); opacity: 1; }
                85% { transform: translate(-50%, 0); opacity: 1; }
                100% { transform: translate(-50%, -150%); opacity: 0; }
            }
            .animate-toast-in-out {
                animation: toast-in-out 4s ease-in-out forwards;
            }
        `}</style>
    </div>
  );
};