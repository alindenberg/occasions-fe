import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            credits: number
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}