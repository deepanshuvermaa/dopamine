import React, { useState } from 'react';

interface PreferenceSelectorProps {
  onComplete: (preferences: string[], username: string, region: string) => void;
  initialPreferences: string[];
  initialUsername: string;
  initialRegion: string;
}

const TOPICS = [
  'Science & Tech', 'History', 'Geopolitics', 'Art & Culture',
  'Nature & Animals', 'Sports', 'Pop Culture', 'Crypto & Finance',
  'Weird Facts', 'Philosophy',
];

// A representative list of countries. A full list would be very long.
const COUNTRIES = [
    "United States", "India", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Brazil", "Japan", "Nigeria", "South Africa", "Mexico", "Singapore"
];

export const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ onComplete, initialPreferences, initialUsername, initialRegion }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialPreferences);
  const [username, setUsername] = useState<string>(initialUsername === 'CuriousMind' ? '' : initialUsername);
  const [region, setRegion] = useState<string>(initialRegion);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSubmit = () => {
    if (selectedTopics.length > 0 && username.trim().length > 2 && region) {
      onComplete(selectedTopics, username.trim(), region);
    }
  };
  
  const isButtonDisabled = selectedTopics.length === 0 || username.trim().length < 3 || !region;

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full animate-fade-in">
      <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
        Customize Your Feed
      </h2>
      <p className="text-md text-gray-400 mb-6">
        First, tell us a bit about yourself.
      </p>

       <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username..."
        maxLength={20}
        className="w-full max-w-xs px-4 py-3 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:ring-0 outline-none transition-colors duration-200 mb-4"
      />
       <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full max-w-xs px-4 py-3 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:ring-0 outline-none transition-colors duration-200 mb-8"
        >
            <option value="" disabled>Select your region...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Other">Other</option>
        </select>


      <p className="text-md text-gray-400 mb-4">
        Now, what are you curious about?
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-8">
        {TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`p-3 rounded-lg font-semibold text-center text-sm transition-all duration-200 ease-in-out transform hover:scale-105 ${
                isSelected
                  ? 'bg-cyan-500 text-white shadow-lg ring-2 ring-cyan-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
      >
        Continue
      </button>
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