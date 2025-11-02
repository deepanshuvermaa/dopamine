import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const handleSelectKey = async () => {
        // @ts-ignore
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            // Per documentation, assume success and proceed.
            // The app's error handling will catch if the key is invalid.
            onKeySelected();
        } else {
            alert("API Key selection module is not available.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
            <div className="relative w-28 h-28 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-xl"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-gray-800 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7h2a2 2 0 012 2v4a2 2 0 01-2 2h-2m-6 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-6 0a2 2 0 01-2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9m6-12a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V7z" />
                    </svg>
                </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                API Key Required
            </h1>
            <p className="text-md text-gray-300 max-w-sm">
                This app uses Google's Veo model for GIF-style video generation, which requires you to select your own API key.
            </p>
             <p className="text-xs text-gray-500 max-w-sm">
                Please ensure your project has billing enabled to use the video generation features. For more info, visit{' '}
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    Google's billing documentation
                </a>.
            </p>
            <div className="pt-4">
                <button
                    onClick={handleSelectKey}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    Select API Key
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
