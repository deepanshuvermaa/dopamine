import React from 'react';

interface AiExplainerProps {
  title: string;
  content: string;
  onBack: () => void;
}

export const AiExplainer: React.FC<AiExplainerProps> = ({ title, content, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-gray-800 rounded-2xl animate-fade-in">
      <header className="flex items-center pb-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-center flex-grow bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">{title}</h2>
        <div className="w-8"></div>
      </header>
      
      <div className="flex-grow overflow-y-auto py-4">
        {content === 'Thinking...' ? (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        ) : (
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {content}
            </p>
        )}
      </div>
       <style>{`
            @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};
