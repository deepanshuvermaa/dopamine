import type { Achievement, UserProfile, UnlockedAchievement } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
    { id: 'view_1', title: 'Curious Newbie', description: 'View your first Drip.', icon: '💧' },
    { id: 'view_10', title: 'Brain Feeder', description: 'View 10 Drips.', icon: '🧠' },
    { id: 'view_50', title: 'Knowledge Junkie', description: 'View 50 Drips.', icon: '📚' },
    { id: 'view_100', title: 'Sage in Training', description: 'View 100 Drips.', icon: '🦉' },
    { id: 'fav_1', title: 'First Find', description: 'Favorite your first Drip.', icon: '❤️' },
    { id: 'fav_10', title: 'Collector', description: 'Favorite 10 Drips.', icon: '💎' },
    { id: 'fav_25', title: 'Curator', description: 'Favorite 25 Drips.', icon: '🖼️' },
    { id: 'comment_1', title: 'First Words', description: 'Write your first comment.', icon: '💬' },
    { id: 'comment_10', title: 'Social Butterfly', description: 'Write 10 comments.', icon: '🦋' },
    { id: 'create_1', title: 'Creator', description: 'Create your first Drip.', icon: '🎨' },
    { id: 'create_5', title: 'Meme Lord', description: 'Create 5 Drips.', icon: '👑' },
];

export const checkAndAwardAchievements = (
    profile: UserProfile, 
    unlocked: UnlockedAchievement[]
): Achievement[] => {
    const newlyUnlocked: Achievement[] = [];
    const unlockedIds = new Set(unlocked.map(a => a.achievementId));

    const check = (id: string, condition: boolean) => {
        if (!unlockedIds.has(id) && condition) {
            const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id);
            if (achievement) {
                newlyUnlocked.push(achievement);
            }
        }
    };

    // View Achievements
    check('view_1', profile.dripsViewed >= 1);
    check('view_10', profile.dripsViewed >= 10);
    check('view_50', profile.dripsViewed >= 50);
    check('view_100', profile.dripsViewed >= 100);

    // Favorite Achievements
    check('fav_1', profile.favoritesSaved >= 1);
    check('fav_10', profile.favoritesSaved >= 10);
    check('fav_25', profile.favoritesSaved >= 25);

    // Comment Achievements
    check('comment_1', profile.commentsMade >= 1);
    check('comment_10', profile.commentsMade >= 10);

    // Creation Achievements
    check('create_1', profile.dripsCreated >= 1);
    check('create_5', profile.dripsCreated >= 5);

    return newlyUnlocked;
};