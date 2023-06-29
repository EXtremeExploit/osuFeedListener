export type CallbackType = (id: number, factor: number, text: string, parsed: EventResolved) => void;

export type ModeInt = '0' | '1' | '2' | '3';
export type ModeString = 'osu!' | 'osu!taiko' | 'osu!catch' | 'osu!mania';
export type MapStatus = 'ranked' | 'approved' | 'qualified' | 'loved';

export type EventType = 'highscore' |
    'epicHighscore' |
    'lostFirstPlace' |
    'medal' |
    'mapUpdated' |
    'mapSubmitted' |
    'mapDeleted' |
    'mapRevival' |
    'mapRankingStatusChanged' |
    'mapPlayedXTimes' |
    'usernameChange' |
    'osuSupport' |
    'osuSupportAgain' |
    'osuSupportReceiveGift' |
    'UNKNOWN';

export type EventDataHighscore = {
    grade: string;
    uid: string;
    username: string;
    rank: string;
    beatmapId: string;
    modeInt: ModeInt;
    beatmapName: string;
    modeString: ModeString;
}

export type EventDataLostFirstPlace = {
    uid: string;
    username: string;
    beatmapId: string;
    modeInt: ModeInt;
    beatmapName: string;
    modeString: ModeString;
}

export type EventDataMedalUnlock = {
    uid: string;
    username: string;
    medalName: string;
}

export type EventDataMapUpdated = {
    uid: string;
    username: string;
    beatmapSetId: string;
    beatmapSetName: string;
}

export type EventDataMapSubmitted = {
    uid: string;
    username: string;
    beatmapSetId: string;
    beatmapSetName: string;
}

export type EventDataMapDeleted = {
    uid: string;
    username: string;
    beatmapSetId: string;
    beatmapSetName: string;
}

export type EventDataMapRevival = {
    beatmapSetId: string;
    beatmapSetName: string;
    uid: string;
    username: string;
}

export type EventDataMapRankingStatusChanged = {
    beatmapSetId: string;
    beatmapSetName: string;
    uid: string;
    username: string;
    status: MapStatus;
}

export type EventDataMapPlayedXTimes = {
    beatmapId: string;
    beatmapName: string;
    times: string;
}

export type EventDataUsernameChange = {
    uid: string;
    usernameOld: string;
    usernameNew: string;
}

export type EventDataOsuSupport = {
    uid: string;
    username: string;
}

export type EventDataResolvedAny = EventDataHighscore |
    EventDataLostFirstPlace |
    EventDataMedalUnlock |
    EventDataMapUpdated |
    EventDataMapSubmitted |
    EventDataMapDeleted |
    EventDataMapRevival |
    EventDataMapRankingStatusChanged |
    EventDataMapPlayedXTimes |
    EventDataUsernameChange |
    EventDataOsuSupport

export type EventResolved = {
    type: EventType;
    data: EventDataResolvedAny | null;
};
