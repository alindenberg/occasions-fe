import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            credits: number
            name?: string | null
            email?: string | null
            image?: string | null
            is_email_verified: boolean | null
        }
    }
    interface User {
        accessToken: string
        accessTokenExpires: number
        refreshToken: string
    }
}