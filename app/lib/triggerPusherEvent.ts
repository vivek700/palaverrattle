import { pusherServer } from "@/app/lib/pusher";


const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export default async function triggerPusherEvent(channel: string, event: string, data: any, retries = MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await pusherServer.trigger(channel, event, data);
            return;
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            console.error(`Attempt ${attempt} failed:`, error);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}