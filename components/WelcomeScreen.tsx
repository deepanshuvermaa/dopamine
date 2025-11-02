
import React from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
             <div className="relative w-28 h-28 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-xl"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-gray-800 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Dopamine Drip
            </h1>
            <p className="text-lg text-gray-300 max-w-sm">
                Tired of wasting time? Get your daily dopamine hit from knowledge, delivered as AI-powered memes.
            </p>
            <div className="pt-6">
                <button
                    onClick={onStart}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
                >
                    Start Learning
                </button>
            </div>
             <style>{`
                @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
   