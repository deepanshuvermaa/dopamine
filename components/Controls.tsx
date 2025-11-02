import React from 'react';

interface ControlsProps {
  onNext: () => void;
  onOpenProfile: () => void;
  onOpenUploader: () => void;
  isNextDisabled?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onNext, onOpenProfile, onOpenUploader, isNextDisabled = false }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-30 flex items-center justify-between">
      {/* Profile Button */}
      <button
        onClick={onOpenProfile}
        className="p-4 bg-black/40 text-gray-300 rounded-full shadow-md backdrop-blur-md hover:bg-black/60 hover:text-white transform transition-all duration-300 ease-in-out"
        aria-label="View profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      </button>

      {/* Upload Button */}
      <button
        onClick={onOpenUploader}
        className="p-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out"
        aria-label="Create a new Drip"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      </button>

      {/* Next Drip Button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="p-4 bg-black/40 text-gray-300 rounded-full shadow-md backdrop-blur-md hover:bg-black/60 hover:text-white transform transition-all duration-300 ease-in-out disabled:text-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        aria-label="Next Knowledge Drip"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};