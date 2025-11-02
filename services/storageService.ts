import type { KnowledgeContent, UserProfile, Comment, UnlockedAchievement } from '../types';

const PREFERENCES_KEY = 'userPreferences';
const FAVORITES_KEY = 'userFavorites';
const FALLBACK_KEY = 'fallbackDrips';
const USER_PROFILE_KEY = 'userProfile';
const COMMENTS_KEY = 'userComments';
const UNLOCKED_ACHIEVEMENTS_KEY = 'userUnlockedAchievements';

// A small, high-quality set of fallback drips to ensure the app always has content.
// The mediaUrl is a simple 1x1 transparent GIF to avoid large bundle sizes and ensure fast loading.
const TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

const PREPACKAGED_DRIPS: KnowledgeContent[] = [
    { id: 'prepackaged-1', fact: "A group of pugs is called a 'grumble'.", funnyCaption: "The squad when the pizza arrives.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-2', fact: "The unicorn is the national animal of Scotland.", funnyCaption: "They said be realistic, so I chose a unicorn.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-3', fact: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.", funnyCaption: "My skincare routine goals.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-4', fact: "A single strand of spaghetti is called a 'spaghetto'.", funnyCaption: "My social battery at the end of the day.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-5', fact: "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.", funnyCaption: "Me after one compliment.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-6', fact: "Octopuses have three hearts.", funnyCaption: "Two to fall in love, one to run the systems.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-7', fact: "There are more fake flamingos in the world than real ones.", funnyCaption: "The ultimate influencers.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-8', fact: "Bananas are berries, but strawberries are not.", funnyCaption: "My whole life has been a lie.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-9', fact: "Wombat poop is cube-shaped.", funnyCaption: "Nature's little Minecraft blocks.", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
    { id: 'prepackaged-10', fact: "It's impossible to hum while holding your nose.", funnyCaption: "You just tried it, didn't you?", mediaUrl: TRANSPARENT_GIF, mediaType: 'image' },
];

export const getPrepackagedDrips = (): KnowledgeContent[] => {
    return PREPACKAGED_DRIPS;
}


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
    return safeJsonParse<UserProfile>(USER_PROFILE_KEY, { username: 'CuriousMind', region: '', dripsViewed: 0, favoritesSaved: 0, commentsMade: 0, dripsCreated: 0 });
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