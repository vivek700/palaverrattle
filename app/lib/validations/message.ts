import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string().optional(),
  timestamp: z.number(),
  image: z.string().url().optional(),
  video: z.string().url().optional(),
  type: z.string().optional()
});




export const mArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
