import { EventsResponse } from "./types.ts";

export class FeedListener {
    client_id: string;
    client_secret: string;
    token: string;
    expires_at: number;
    constructor(client_id: string, client_secret: string) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.token = '';
        this.expires_at = 0; // Start at 0 to always mark token as expired
    }

    /**
     * Requests a guerst token and stores it
     */
    async requestToken(): Promise<void> {
        const url = new URL('https://osu.ppy.sh/oauth/token');

        const data = {
            "client_id": this.client_id,
            "client_secret": this.client_secret,
            "grant_type": "client_credentials",
            "scope": "public"
        };

        const req = await fetch(url, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: (new URLSearchParams(data)).toString()
        });

        const resJson = await req.json() as {
            "access_token": string;
            "expires_in": number;
            "token_type": string;
        };

        const secondsSinceUNIX = Math.floor(new Date().getTime() / 1000);

        this.token = resJson.access_token;
        this.expires_at = secondsSinceUNIX + resJson.expires_in - 10 * 60; // Give 10 minutes less to make sure it never expires, usually they expire in 24 hours so its fine
    }

    get isTokenExpired() {
        const secondsSinceUNIX = Math.floor(new Date().getTime() / 1000);
        return secondsSinceUNIX > this.expires_at;
    }

    /**
     * 
     * @param cursor_string Used to look at events older than than the last 50, useful for when there are too many events to fit in the array of 50 elements
     * @returns A cursor_string and a list of events
     */
    async getEvents(cursor_string: string | null = null): Promise<EventsResponse> {
        if (this.isTokenExpired)
            await this.requestToken();

        const url = new URL(`https://osu.ppy.sh/api/v2/events`);
        url.searchParams.append('sort', 'id_desc');
        if (cursor_string != null)
            url.searchParams.append('cursor_string', cursor_string);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.token}`
            }
        });

        const resJson = await res.json();
        return resJson;
    }
}
