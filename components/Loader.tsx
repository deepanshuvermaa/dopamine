
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-cyan-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-gray-800 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-300">Generating your knowledge drip...</p>
      <p className="text-sm text-gray-500">This can take a moment.</p>
    </div>
  );
};
   