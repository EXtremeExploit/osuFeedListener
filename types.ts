export type EventType = 'achievement' |
    'beatmapPlaycount' |
    'beatmapsetApprove' |
    'beatmapsetDelete' |
    'beatmapsetRevive' |
    'beatmapsetUpdate' |
    'beatmapsetUpload' |
    'rank' |
    'rankLost' |
    'userSupportAgain' |
    'userSupportFirst' |
    'userSupportGift' |
    'usernameChange';

export type GameMode = 'osu' | 'taiko' | 'fruits' | 'mania'

export interface EventBeatmap {
    title: string;
    url: string;
}

export interface EventBeatmapset {
    title: string;
    url: string;
}

export interface EventUser {
    username: string;
    url: string;
    previousUsername?: string; // Only on usernameChange event
}

export interface Achievement {
    description: string;
    grouping: string;
    icon_url: string;
    id: number;
    instructions: string;
    mode: GameMode | null; // null for medals without mode restrictions
    name: string;
    ordering: number;
    slug: string;
}

export interface AchievementEvent extends FeedEvent {
    achievement: Achievement;
    user: EventUser;
}

export interface BeatmapPlaycountEvent extends FeedEvent {
    beatmap: EventBeatmap;
    count: number;
}

export interface BeatmapsetApproveEvent extends FeedEvent {
    approval: 'ranked' | 'approved' | 'qualified' | 'loved';
    beatmapset: EventBeatmapset;
    user: EventUser;
}

export interface BeatmapsetDeleteEvent extends FeedEvent {
    beatmapset: EventBeatmapset;
}

export interface BeatmapsetReviveEvent extends FeedEvent {
    beatmapset: EventBeatmapset;
    user: EventUser;
}

export interface BeatmapsetUpdateEvent extends FeedEvent {
    beatmapset: EventBeatmapset;
    user: EventUser;
}

export interface BeatmapsetUploadEvent extends FeedEvent {
    beatmapset: EventBeatmapset;
    user: EventUser;
}

export interface RankEvent extends FeedEvent {
    scoreRank: string;
    rank: number;
    mode: GameMode;
    beatmap: EventBeatmap;
    user: EventUser;
}

export interface RankLostEvent extends FeedEvent {
    mode: GameMode;
    beatmap: EventBeatmap;
    user: EventUser;
}

export interface UserSupportAgainEvent extends FeedEvent {
    user: EventUser;
}

export interface UserSupportFirstEvent extends FeedEvent {
    user: EventUser;
}

export interface UserSupportGiftEvent extends FeedEvent {
    user: EventUser;
}

export interface UsernameChangeEvent extends FeedEvent {
    user: EventUser;
}

export type FeedEvent = {
    created_at: string;
    id: number,
    type: EventType
}

export type EventsResponse = {
    cursor_string: string; // the cursor used to get even older events

    /**
     * List containing the events, lower index means more recent, and higher index means older event
     */
    events: FeedEvent[];
}
