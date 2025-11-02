import React from 'react';
import type { ExplanationMode } from '../types';

interface ActionMenuProps {
    onExplainRequest: (mode: ExplanationMode) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onExplainRequest }) => {
    return (
        <div className="absolute top-full mt-2 right-0 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl overflow-hidden animate-menu-in">
            <ul className="text-white font-medium">
                <li>
                    <button 
                        onClick={() => onExplainRequest('simple')}
                        className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-cyan-500/20 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Explain Simply
                    </button>
                </li>
                <li>
                    <button 
                        onClick={() => onExplainRequest('deep')}
                        className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-cyan-500/20 transition-colors duration-150"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Go Deeper
                    </button>
                </li>
            </ul>
            <style>{`
                @keyframes menu-in {
                    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-menu-in {
                    animation: menu-in 0.15s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
