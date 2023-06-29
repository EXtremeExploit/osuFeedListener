
function GetLogDate() {
    const d = new Date();

    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    const hours = d.getUTCHours().toString().padStart(2, '0');
    const mins = d.getUTCMinutes().toString().padStart(2, '0');
    const seconds = d.getUTCSeconds().toString().padStart(2, '0');
    const millis = d.getUTCMilliseconds().toString().padStart(3, '0');
    return `${year}/${month}/${day}@${hours}:${mins}:${seconds}.${millis}`;
}

export function LOG(txt: string) {
    console.log(`${GetLogDate()} | ${txt}`);
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export type OsekaiMedal = {
    medalid: string;
    name: string;
    link: string;
    description: string;
    restriction: string;
    grouping: string;
    instructions: string;
    ordering: string;
    packid: string;
    video: string;
    date: string;
    firstachieveddate: string;
    firstachievedby: string;
}