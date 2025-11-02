import type { KnowledgeContent, UserProfile, Comment, UnlockedAchievement } from '../types';

const PREFERENCES_KEY = 'userPreferences';
const FAVORITES_KEY = 'userFavorites';
const FALLBACK_KEY = 'fallbackDrips';
const USER_PROFILE_KEY = 'userProfile';
const COMMENTS_KEY = 'userComments';
const UNLOCKED_ACHIEVEMENTS_KEY = 'userUnlockedAchievements';


const safeJsonParse = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        return defaultValue;
    }
};

// User Preferences
export const getUserPreferences = (): string[] => {
    return safeJsonParse<string[]>(PREFERENCES_KEY, []);
};

export const saveUserPreferences = (preferences: string[]): void => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

// Favorites
export const getFavorites = (): KnowledgeContent[] => {
    return safeJsonParse<KnowledgeContent[]>(FAVORITES_KEY, []);
};

export const saveFavorites = (favorites: KnowledgeContent[]): void => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Fallback Drips
export const getFallbackDrips = (): KnowledgeContent[] => {
    return safeJsonParse<KnowledgeContent[]>(FALLBACK_KEY, []);
};

export const saveFallbackDrips = (drips: KnowledgeContent[]): void => {
    // Save a limited number of drips to avoid excessive storage usage
    const existingDrips = getFallbackDrips();
    const combined = [...drips, ...existingDrips];
    const uniqueDrips = Array.from(new Map(combined.map(item => [item.id, item])).values());
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(uniqueDrips.slice(0, 10)));
};

// User Profile
export const getUserProfile = (): UserProfile => {
    return safeJsonParse<UserProfile>(USER_PROFILE_KEY, { username: 'CuriousMind', region: 'United States', dripsViewed: 0, favoritesSaved: 0, commentsMade: 0, dripsCreated: 0 });
};

export const saveUserProfile = (profile: UserProfile): void => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

// Comments
export const getComments = (): Record<string, Comment[]> => {
    return safeJsonParse<Record<string, Comment[]>>(COMMENTS_KEY, {});
};

export const saveComments = (comments: Record<string, Comment[]>): void => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

// Achievements
export const getUnlockedAchievements = (): UnlockedAchievement[] => {
    return safeJsonParse<UnlockedAchievement[]>(UNLOCKED_ACHIEVEMENTS_KEY, []);
}

export const saveUnlockedAchievements = (achievements: UnlockedAchievement[]): void => {
    localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}