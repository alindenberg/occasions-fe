import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            router.push('/')
        } else {
            const errorData = await response.json()
            setError(errorData.error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
            {error && <p>{error}</p>}
        </form>
    )
}