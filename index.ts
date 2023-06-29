import { FeedListener } from './listener.ts';
import { AchievementEvent } from './types.ts';
import { LOG } from './util.ts';

const CLIENT_ID = Deno.env.get('CLIENT_ID');
const CLIENT_SECRET = Deno.env.get('CLIENT_SECRET');
if (typeof CLIENT_ID == 'undefined')
    throw 'Expected CLIENT_ID env var';
if (typeof CLIENT_SECRET == 'undefined')
    throw 'Expected CLIENT_SECRET env var';
const feed = new FeedListener(CLIENT_ID, CLIENT_SECRET);

let knownMostRecent = 0;
async function getEvents() {
    const res = await feed.getEvents();
    const events = res.events;
    const newEvents = events.slice(0, events[0].id - knownMostRecent);
    knownMostRecent = events[0].id; // Mark the new newest known
    newEvents.forEach((ev) => {
        if (ev.type == 'achievement') {
            const event = ev as AchievementEvent;
            LOG(`${event.user.username.padEnd(20, ' ')} | ${event.achievement.name}`);
            if (event.achievement.name == 'Skylord') {
                LOG(`${event.user.username} GOT THE SKYLORD NOWAY`);
            }
        }
    });
}

LOG("Listening... :eyes:");
await getEvents();
setInterval(getEvents, 10000);
