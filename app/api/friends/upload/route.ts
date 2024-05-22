import { auth } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";
import { db } from "@/app/lib/db";
import { fetchRedis } from "@/app/lib/redis";
import triggerPusherEvent from "@/app/lib/triggerPusherEvent";
import { toPusherKey } from "@/app/lib/utils/toPusherKey";
import { Message, messageValidator } from "@/app/lib/validations/message";
import fileUploadSchema from "@/app/lib/validations/uploadFile";
import { nanoid } from "nanoid";


export async function POST(req: Request) {
    const body = await req.json()

    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }


    const validationRes = fileUploadSchema.safeParse(body)

    if (!validationRes.success) {
        const errorMessage = validationRes.error.errors.map(err => err.message).join(',')
        return new Response(`Invalid request: ${errorMessage}`, { status: 400 })

    }

    const { file, chatId, type } = validationRes.data




    const timestamp = Date.now();


    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
        return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;


    const rawSender = (await fetchRedis(
        "get",
        `user:${session.user.id}`,
    )) as string;

    const sender = JSON.parse(rawSender) as User;



    try {
        await cloudinary.uploader.upload(file, { resource_type: 'auto' },
            async (error: any, result: any) => {
                let messageData: Message;
                if (type.startsWith("image")) {

                    messageData = {
                        id: nanoid(),
                        senderId: session.user.id,
                        image: result.secure_url,
                        type: type,
                        timestamp,
                    };
                } else if (type.startsWith("video")) {
                    messageData = {
                        id: nanoid(),
                        senderId: session.user.id,
                        video: result.secure_url,
                        type: type,
                        timestamp,
                    };
                } else {
                    // Handle other types or throw an error if not supported
                    throw new Error('Unsupported message type');
                }


                const validMessage = messageValidator.safeParse(messageData!);

                let message: Message | undefined;

                if (validMessage.success) {
                    message = validMessage.data

                    await triggerPusherEvent(toPusherKey(`chat:${chatId}`), "incoming-message", message);
                    await triggerPusherEvent(toPusherKey(`user:${friendId}:chats`), "new_message", {
                        ...message,
                        senderImg: sender.image,
                        senderName: sender.name,
                    });

                    await db.zadd(`chat:${chatId}:messages`, {
                        score: timestamp,
                        member: JSON.stringify(message),
                    });

                } else {
                    throw new Error('Parsing failed.')
                }


            }
        )
    } catch (error) {
        console.log('upload failed:', error)
        if (error instanceof Error) {
            return new Response(error.message, {
                status: 500,
            });
        }
        return new Response('failed to send', { status: 500 })
    }


    return new Response('OK')

}
