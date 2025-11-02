import React, { useState, useRef, useEffect } from 'react';
import type { KnowledgeContent } from '../types';

interface MemeUploaderProps {
  onSubmit: (content: Omit<KnowledgeContent, 'id' | 'isUserGenerated' | 'author'>) => void;
  onBack: () => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const MemeUploader: React.FC<MemeUploaderProps> = ({ onSubmit, onBack }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fact, setFact] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!mediaFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(mediaFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [mediaFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File is too large. Max 10MB.");
        return;
      }
      setError(null);
      setMediaFile(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!mediaFile || !fact.trim() || !caption.trim()) {
      setError("Please fill all fields and select a file.");
      return;
    }
    
    try {
        const mediaUrl = await fileToDataUrl(mediaFile);
        const mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
        
        onSubmit({ fact, funnyCaption: caption, mediaUrl, mediaType });

    } catch (e) {
        setError("Could not process the file. Please try another one.");
        console.error("File processing error:", e);
    }
  };

  const isFormValid = mediaFile && fact.trim() && caption.trim();

  return (
    <div className="w-full h-full flex flex-col p-4 bg-gray-800 rounded-2xl animate-fade-in">
      <header className="flex items-center pb-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-center flex-grow">Create a Drip</h2>
        <div className="w-8"></div>
      </header>

      <div className="flex-grow overflow-y-auto py-4 space-y-4">
        <div 
            className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer hover:border-cyan-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          {previewUrl ? (
            mediaFile?.type.startsWith('video/') ? (
              <video src={previewUrl} className="w-full h-full object-contain" autoPlay loop muted />
            ) : (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            )
          ) : (
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p>Tap to upload Image/Video</p>
              <p className="text-xs">(Max 10MB)</p>
            </div>
          )}
        </div>

        <div>
            <label htmlFor="fact" className="block text-sm font-medium text-gray-300 mb-1">The Fact</label>
            <textarea
                id="fact"
                value={fact}
                onChange={e => setFact(e.target.value)}
                placeholder="Did you know? A group of flamingos is called a flamboyance."
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
                rows={3}
            />
        </div>
         <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-1">Funny Caption</label>
            <input
                id="caption"
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Me and the squad pulling up"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-cyan-500 focus:ring-0 outline-none transition-colors"
            />
        </div>
        
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      </div>

      <div className="pt-4 border-t border-gray-700">
          <button 
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
          >
            Submit Drip
          </button>
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
