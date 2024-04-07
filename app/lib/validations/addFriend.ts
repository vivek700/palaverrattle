
import { z } from 'zod'

export const validator = z.object({
    email: z.string().email({ message: 'Invalid email address' })
})