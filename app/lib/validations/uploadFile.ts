import { z } from 'zod';

const fileUploadSchema = z.object({
    file: z.string().url({ message: "Invalid file URL" }),
    chatId: z.string(),
}).required();


export default fileUploadSchema