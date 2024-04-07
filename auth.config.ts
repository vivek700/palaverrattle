
import type { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";


function getCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        throw new Error("Missing clientId or clientSecret")
    }
    return { clientId, clientSecret }

}

export default {
    providers: [google({

        clientId: getCredentials().clientId,
        clientSecret: getCredentials().clientSecret,
    })],

} satisfies NextAuthConfig