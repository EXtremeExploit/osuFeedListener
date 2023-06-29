import {
	EventResolved,
	CallbackType,
	EventDataHighscore,
	EventDataLostFirstPlace,
	EventDataMedalUnlock,
	EventDataMapUpdated,
	EventDataMapSubmitted,
	EventDataMapDeleted,
	EventDataMapRevival,
	EventDataMapRankingStatusChanged,
	EventDataMapPlayedXTimes,
	EventDataUsernameChange,
	EventDataOsuSupport,
	EventType,
	EventDataResolvedAny
} from './oldTypes.ts'
export type {
	EventResolved,
	CallbackType,
	EventDataHighscore,
	EventDataLostFirstPlace,
	EventDataMedalUnlock,
	EventDataMapUpdated,
	EventDataMapSubmitted,
	EventDataMapDeleted,
	EventDataMapRevival,
	EventDataMapRankingStatusChanged,
	EventDataMapPlayedXTimes,
	EventDataUsernameChange,
	EventDataOsuSupport,
	EventType,
	EventDataResolvedAny
}

let eventId = 0; // When requesting the ID 0, it replies with the 10th latest event, we want that to also have some overhead
export async function getEvents(callback: CallbackType) {
	const req = await fetch(`https://osu.ppy.sh/pages/include/eventfeed.php?i=${eventId}`);

	const msg = await req.text();
	const split = msg.split('\n');

	// osu will always reply with the event id that should be fetched NEXT
	// If the event we are asking for doesnt exists yet, it will say to 
	// fetch it again, so we set it again to fetch it again in the next batch
	eventId = parseInt(split[0]);

	if (split.length > 1) { // If the event exists, process it
		const epicfactor = parseInt(split[1]);
		const text = split[2];

		const er = eventResolver(text);
		callback(eventId, epicfactor, text, er);

		getEvents(callback);
	} else // If it doesn't exist, we end the recursion and set another timeout for 3 seconds to give overhead
		setTimeout(getEvents, 3000, callback);
}

export function eventResolver(text: string): EventResolved {
	const patterns: { type: EventType, regex: string }[] = [
		{ type: 'highscore', regex: `^<img src='\/\/s\.ppy\.sh\/images\/(?<grade>.*)_small\.png'\/> <b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> achieved rank #(?<rank>.*) on <a href='\/b\/(?<beatmapId>.*)\?m=(?<modeInt>.)'>(?<beatmapName>.*)<\/a> \((?<modeString>.*)\)$` },
		{ type: 'epicHighscore', regex: `^<img src='\/\/s\.ppy\.sh\/images\/(?<grade>.*)_small\.png'\/> <b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> achieved <b>rank #(?<rank>.*)<\/b> on <a href='\/b\/(?<beatmapId>.*)\?m=(?<modeInt>.)'>(?<beatmapName>.*)<\/a> \((?<modeString>.*)\)$` },
		{ type: 'lostFirstPlace', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has lost first place on <a href='\/b\/(?<beatmapId>.*)\?m=(?<modeInt>.)'>(?<beatmapName>.*)<\/a> \((?<modeString>.*)\)$` },
		{ type: 'medal', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> unlocked the "<b>(?<medalName>.*)<\/b>" medal!$` },
		{ type: 'mapUpdated', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has updated the beatmap "<a href='\/(beatmapsets|s)\/(?<beatmapSetId>.*)'>(?<beatmapSetName>.*)<\/a>"$` },
		{ type: 'mapSubmitted', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has submitted a new beatmap "<a href='\/(beatmapsets|s)\/(?<beatmapSetId>.*)'>(?<beatmapSetName>.*)<\/a>"$` },
		{ type: 'mapDeleted', regex: `^<a href='\/(beatmapsets|s)\/(?<beatmapSetId>.*)'>(?<beatmapSetName>.*)<\/a> has been deleted\.$` },
		{ type: 'mapRevival', regex: `^<a href='\/(beatmapsets|s)\/(?<beatmapSetId>.*)'>(?<beatmapSetName>.*)<\/a> has been revived from eternal slumber by <b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b>\.$` },
		{ type: 'mapRankingStatusChanged', regex: `^<a href='\/(beatmapsets|s)\/(?<beatmapSetId>.*)'>(?<beatmapSetName>.*)<\/a> by <b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has just been (?<status>ranked|approved|qualified|loved)!$` },
		{ type: 'mapPlayedXTimes', regex: `^<a href='\/b\/(?<beatmapId>.*)'>(?<beatmapName>.*)<\/a> has been played (?<times>.*) times!$` },
		{ type: 'usernameChange', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<usernameOld>.*)<\/a><\/b> has changed their username to (?<usernameNew>.*)!$` },
		{ type: 'osuSupport', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has become an osu! supporter - thanks for your generosity!$` },
		{ type: 'osuSupportAgain', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has once again chosen to support osu! - thanks for your generosity!$` },
		{ type: 'osuSupportReceiveGift', regex: `^<b><a href='\/(users|u)\/(?<uid>.*)'>(?<username>.*)<\/a><\/b> has received the gift of osu! supporter!$` },
	];

	for (const pattern of patterns) {
		const regex = new RegExp(pattern.regex);
		const matches = regex.exec(text);
		if (!matches) continue;
		const { groups } = matches;
		return {
			type: pattern.type,
			data: groups as EventDataResolvedAny
		};
	}

	// fallback
	return {
		type: 'UNKNOWN',
		data: null
	};
}
