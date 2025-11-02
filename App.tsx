import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { KnowledgeContent, AppState, ExplanationMode, UserProfile, Comment, Achievement, UnlockedAchievement } from './types';
import { generateKnowledgeBatch, getExplanation } from './services/geminiService';
import * as storage from './services/storageService';
import * as achievementService from './services/achievementsService';
import { getRegionByIP } from './services/locationService';
import { KnowledgeCard } from './components/KnowledgeCard';
import { Loader } from './components/Loader';
import { Controls } from './components/Controls';
import { ErrorDisplay } from './components/ErrorDisplay';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PreferenceSelector } from './components/PreferenceSelector';
import { ProfileScreen } from './components/ProfileScreen';
import { AiExplainer } from './components/AiExplainer';
import { AchievementToast } from './components/AchievementToast';
import { CommentsSection } from './components/CommentsSection';
import { MemeUploader } from './components/MemeUploader';

const INITIAL_FETCH_COUNT = 4;
const REFILL_COUNT = 3;
const MIN_QUEUE_SIZE = 3;
const SWIPE_THRESHOLD = 50;
const PULL_REFRESH_THRESHOLD = 80;

const PullToRefreshIndicator: React.FC<{ pullDistance: number; isRefreshing: boolean }> = ({ pullDistance, isRefreshing }) => {
  const pullProgress = Math.min(pullDistance / PULL_REFRESH_THRESHOLD, 1);

  if (isRefreshing) {
    return (
      <div className="flex space-x-1.5 justify-center items-center">
        <span className="sr-only">Loading...</span>
        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 transition-opacity duration-200" style={{ opacity: pullProgress }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-gray-500 rounded-full transition-transform duration-200 ease-out"
          style={{ transform: `scaleY(${1 + pullProgress * (i + 2)})` }}
        ></div>
      ))}
    </div>
  );
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [contentQueue, setContentQueue] = useState<KnowledgeContent[]>([]);
  const [favorites, setFavorites] = useState<KnowledgeContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [detectedRegion, setDetectedRegion] = useState<string>('United States');
  const [userProfile, setUserProfile] = useState<UserProfile>(storage.getUserProfile());
  const [allComments, setAllComments] = useState<Record<string, Comment[]>>(storage.getComments());
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>(storage.getUnlockedAchievements());
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentingOnContentId, setCommentingOnContentId] = useState<string | null>(null);
  
  const [isExiting, setIsExiting] = useState(false);
  const [explanation, setExplanation] = useState<{ title: string; content: string } | null>(null);
  const [pullState, setPullState] = useState({ startY: 0, pullDistance: 0, isRefreshing: false });

  const isFetching = useRef(false);
  const touchStartY = useRef(0);

  const handleApiError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    console.error("API Error caught:", err);
    setError(errorMessage);
    setAppState('error');
  }, []);

  const fetchQueue = useCallback(async (prefs: string[], count: number, region: string) => {
    if (isFetching.current) return [];
    isFetching.current = true;
    
    try {
      const newContent = await generateKnowledgeBatch(prefs, count, region);
      if (newContent.length > 0) {
        storage.saveFallbackDrips(newContent);
      }
      return newContent;
    } catch (err) {
      handleApiError(err);
      return [];
    } finally {
      isFetching.current = false;
    }
  }, [handleApiError]);

  const loadInitialContent = useCallback(async (prefs: string[], region: string) => {
    if (prefs.length === 0) {
      setAppState('preferences');
      return;
    }
    setAppState('loading');
    setError(null);
    setContentQueue([]);
    const initialContent = await fetchQueue(prefs, INITIAL_FETCH_COUNT, region);

    if (appState === 'error') return;

    if (initialContent.length > 0) {
        setContentQueue(initialContent);
        setAppState('content');
    } else {
        const fallback = storage.getFallbackDrips();
        if (fallback.length > 0) {
            setContentQueue(fallback);
            setAppState('content');
            setError("Couldn't fetch new content. Showing older drips.");
        } else {
            const prepackaged = storage.getPrepackagedDrips();
            if (prepackaged.length > 0) {
                setContentQueue(prepackaged);
                setAppState('content');
                setError("Couldn't connect. Showing some of our favorite drips.");
            } else {
                 setError("The AI couldn't generate content and no fallback is available. Please check your connection.");
                 setAppState('error');
            }
        }
    }
  }, [fetchQueue, appState]);

  useEffect(() => {
    const initializeApp = async () => {
        const savedPreferences = storage.getUserPreferences();
        const savedProfile = storage.getUserProfile();
        setUserProfile(savedProfile);
        setPreferences(savedPreferences);
        setFavorites(storage.getFavorites());

        const region = await getRegionByIP();
        setDetectedRegion(region);

        if (savedPreferences.length > 0) {
            if (!savedProfile.region) {
                const updatedProfile = { ...savedProfile, region };
                setUserProfile(updatedProfile);
                storage.saveUserProfile(updatedProfile);
                loadInitialContent(savedPreferences, region);
            } else {
                 loadInitialContent(savedPreferences, savedProfile.region);
            }
        } else {
            setAppState('welcome');
        }
    };
    initializeApp();
  }, []);

  
  const checkAchievements = useCallback((updatedProfile: UserProfile) => {
     const newAchievements = achievementService.checkAndAwardAchievements(updatedProfile, unlockedAchievements);
      if (newAchievements.length > 0) {
          setUnlockedAchievements(prev => {
              const newEntries = newAchievements.map(a => ({ achievementId: a.id, timestamp: Date.now() }));
              const updated = [...prev, ...newEntries];
              storage.saveUnlockedAchievements(updated);
              return updated;
          });
          setActiveAchievement(newAchievements[0]);
          setTimeout(() => setActiveAchievement(null), 4000);
      }
  }, [unlockedAchievements]);

  const handleNext = useCallback(async () => {
    if (isExiting || contentQueue.length <= 1) return;
    if (navigator.vibrate) navigator.vibrate(50);
    
    setIsExiting(true);
    setTimeout(() => {
      setContentQueue(prev => prev.slice(1));
      setIsExiting(false);
      const updatedProfile = { ...userProfile, dripsViewed: userProfile.dripsViewed + 1 };
      setUserProfile(updatedProfile);
      storage.saveUserProfile(updatedProfile);
      checkAchievements(updatedProfile);
    }, 300);
  }, [contentQueue.length, isExiting, userProfile, checkAchievements]);

  useEffect(() => {
    if (appState === 'content' && contentQueue.length < MIN_QUEUE_SIZE && !isFetching.current) {
      fetchQueue(preferences, REFILL_COUNT, userProfile.region).then(newContent => {
        if(newContent.length > 0) {
            setContentQueue(prev => [...prev, ...newContent]);
        }
      });
    }
  }, [appState, contentQueue.length, preferences, userProfile.region, fetchQueue]);
  
  const handleRefresh = useCallback(async () => {
    if (pullState.isRefreshing) return;
    setPullState(prev => ({ ...prev, isRefreshing: true }));
    const refreshedContent = await fetchQueue(preferences, INITIAL_FETCH_COUNT, userProfile.region,);
    if(refreshedContent.length > 0) {
        setContentQueue(refreshedContent);
    }
    setTimeout(() => setPullState({ startY: 0, pullDistance: 0, isRefreshing: false }), 500);
  }, [pullState.isRefreshing, fetchQueue, preferences, userProfile.region]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; setPullState(prev => ({ ...prev, startY: e.touches[0].clientY })); };
    const handleTouchMove = (e: TouchEvent) => { const pullDistance = e.touches[0].clientY - pullState.startY; if (pullDistance > 0 && window.scrollY === 0) { e.preventDefault(); setPullState(prev => ({ ...prev, pullDistance })); } };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY.current - touchEndY > SWIPE_THRESHOLD) { handleNext(); }
      if (pullState.pullDistance > PULL_REFRESH_THRESHOLD && !pullState.isRefreshing) { handleRefresh(); } else { setPullState(prev => ({ ...prev, pullDistance: 0 })); }
      touchStartY.current = 0;
    };
    const options = { passive: false };
    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);
    window.addEventListener('touchend', handleTouchEnd, options);
    return () => { window.removeEventListener('touchstart', handleTouchStart); window.removeEventListener('touchmove', handleTouchMove); window.removeEventListener('touchend', handleTouchEnd); };
  }, [handleNext, handleRefresh, pullState.startY, pullState.pullDistance, pullState.isRefreshing]);

  const handlePreferencesSubmit = (selectedPreferences: string[], username: string, region: string) => {
    setPreferences(selectedPreferences);
    storage.saveUserPreferences(selectedPreferences);
    const updatedProfile = { ...userProfile, username, region };
    setUserProfile(updatedProfile);
    storage.saveUserProfile(updatedProfile);
    loadInitialContent(selectedPreferences, region);
  };

  const handleRetry = () => { loadInitialContent(preferences, userProfile.region); };

  const toggleFavorite = (content: KnowledgeContent) => {
    let newFavorites: KnowledgeContent[] = [];
    const isFavorited = favorites.some(f => f.id === content.id);
    if (isFavorited) { newFavorites = favorites.filter(f => f.id !== content.id); } else { newFavorites = [...favorites, content]; }
    setFavorites(newFavorites);
    storage.saveFavorites(newFavorites);

    const updatedProfile = { ...userProfile, favoritesSaved: newFavorites.length };
    setUserProfile(updatedProfile);
    storage.saveUserProfile(updatedProfile);
    checkAchievements(updatedProfile);
  };

  const handleExplainRequest = async (fact: string, mode: ExplanationMode) => {
    setAppState('explaining');
    const title = mode === 'simple' ? 'Explained Simply' : 'Diving Deeper';
    setExplanation({ title, content: 'Thinking...' });
    try {
      const result = await getExplanation(fact, mode);
      setExplanation({ title, content: result });
    } catch (e) {
      setExplanation({ title, content: 'Sorry, the AI couldn\'t dive deeper on this topic. It might be too obscure or there was a connection issue. Please try another one.' });
    }
  };
  
  const handleOpenComments = (contentId: string) => { setCommentingOnContentId(contentId); setIsCommentsOpen(true); };
  const handleAddComment = (text: string) => {
    if (!commentingOnContentId) return;
    const newComment: Comment = {
        id: `${Date.now()}`,
        contentId: commentingOnContentId,
        author: userProfile.username,
        text,
        timestamp: Date.now(),
    };
    const updatedComments = { ...allComments, [commentingOnContentId]: [...(allComments[commentingOnContentId] || []), newComment] };
    setAllComments(updatedComments);
    storage.saveComments(updatedComments);

    const updatedProfile = { ...userProfile, commentsMade: userProfile.commentsMade + 1 };
    setUserProfile(updatedProfile);
    storage.saveUserProfile(updatedProfile);
    checkAchievements(updatedProfile);
  };
  const handleUsernameChange = (newName: string) => {
      const updatedProfile = { ...userProfile, username: newName };
      setUserProfile(updatedProfile);
      storage.saveUserProfile(updatedProfile);
  };

  const handleMemeSubmit = (newContent: Omit<KnowledgeContent, 'id' | 'isUserGenerated' | 'author'>) => {
    const fullContent: KnowledgeContent = {
        ...newContent,
        id: `${Date.now()}-user`,
        isUserGenerated: true,
        author: userProfile.username,
    };
    setContentQueue(prev => [fullContent, ...prev]);
    
    const updatedProfile = { ...userProfile, dripsCreated: userProfile.dripsCreated + 1 };
    setUserProfile(updatedProfile);
    storage.saveUserProfile(updatedProfile);
    checkAchievements(updatedProfile);

    setAppState('content');
  };

  const renderContent = () => {
    switch (appState) {
      case 'welcome': return <WelcomeScreen onStart={() => setAppState('preferences')} />;
      case 'preferences': return <PreferenceSelector onComplete={handlePreferencesSubmit} initialPreferences={preferences} initialUsername={userProfile.username} detectedRegion={detectedRegion}/>;
      case 'loading': return <Loader />;
      case 'error': return <ErrorDisplay message={error || 'An unknown error occurred.'} onRetry={handleRetry} />;
      case 'profile': return <ProfileScreen profile={userProfile} favorites={favorites} unlockedAchievements={unlockedAchievements} onBack={() => setAppState('content')} onToggleFavorite={toggleFavorite} onUsernameChange={handleUsernameChange} />;
      case 'explaining': return explanation ? <AiExplainer title={explanation.title} content={explanation.content} onBack={() => setAppState('content')} /> : null;
      case 'uploading': return <MemeUploader onSubmit={handleMemeSubmit} onBack={() => setAppState('content')} />;
      case 'content': {
        const currentContent = contentQueue[0];
        const pullTransform = `translateY(${!pullState.isRefreshing ? Math.min(pullState.pullDistance, PULL_REFRESH_THRESHOLD) : 0}px)`;
        return (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-6 z-0">
              <PullToRefreshIndicator pullDistance={pullState.pullDistance} isRefreshing={pullState.isRefreshing} />
            </div>
            <div style={{ transform: pullTransform, transition: 'transform 0.2s ease-out' }} className="w-full h-full flex items-center justify-center">
              {currentContent ? (
                <>
                  <KnowledgeCard key={currentContent.id} content={currentContent} isExiting={isExiting} isFavorite={favorites.some(f => f.id === currentContent.id)} onToggleFavorite={() => toggleFavorite(currentContent)} onExplainRequest={handleExplainRequest} onOpenComments={() => handleOpenComments(currentContent.id)} />
                  <Controls onNext={handleNext} onOpenUploader={() => setAppState('uploading')} onOpenProfile={() => setAppState('profile')} isNextDisabled={(contentQueue.length <= 1) || isExiting} />
                </>
              ) : <Loader />}
            </div>
          </>
        );
      }
      default: return <Loader />;
    }
  };

  return (
    <main className="h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center overflow-hidden antialiased font-sans">
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col items-center justify-center p-4">
        {renderContent()}
        {activeAchievement && <AchievementToast achievement={activeAchievement} />}
        {isCommentsOpen && commentingOnContentId && (
            <CommentsSection 
                comments={allComments[commentingOnContentId] || []}
                onAddComment={handleAddComment}
                onClose={() => setIsCommentsOpen(false)}
            />
        )}
      </div>
    </main>
  );
};

export default App;