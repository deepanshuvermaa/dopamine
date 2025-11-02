import React, { useState } from 'react';
import type { Comment } from '../types';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onClose: () => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onAddComment, onClose }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="absolute inset-0 bg-black/60 z-40 animate-fade-in-fast" onClick={onClose}>
            <div 
                className="absolute bottom-0 left-0 right-0 h-[70%] bg-gray-800 rounded-t-2xl flex flex-col p-4 animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center pb-2 mb-2 border-b border-gray-700">
                    <h3 className="font-bold text-lg">Comments</h3>
                    <div className="absolute top-3 right-3">
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex-shrink-0 mt-1"></div>
                                <div>
                                    <p className="font-bold text-sm">{comment.author}</p>
                                    <p className="text-gray-300">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Be the first to comment!</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex gap-2 border-t border-gray-700 pt-4">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-full border-2 border-transparent focus:border-cyan-500 focus:ring-0 outline-none transition-colors duration-200"
                    />
                    <button type="submit" className="p-3 bg-cyan-500 rounded-full text-white disabled:bg-gray-600" disabled={!newComment.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </form>
                 <style>{`
                    @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
                    @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }
                `}</style>
            </div>
        </div>
    );
};