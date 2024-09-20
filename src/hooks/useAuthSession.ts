import { useSession, signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export function useAuthSession() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [credits, setCredits] = useState<number | null>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn()
        } else if (session) {
            fetch("/api/auth/session")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Session expired")
                    }
                    return res.json()
                })
                .then(() => fetchUserData())
                .catch(() => {
                    signIn()
                })
        }
    }, [session, status, router])

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/users/me')
            if (response.ok) {
                const data = await response.json()
                setCredits(data.credits)
            } else {
                console.error('Failed to fetch user data')
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    return { session, status, credits }
}