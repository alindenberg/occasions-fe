import { GetServerSideProps } from "next";
import { User } from "@/types/users";

export default function ProfilePage({ user, isAuthenticated }: { user: User, isAuthenticated: boolean }) {
    return (
        <div className="flex flex-grow items-center justify-center">
            <div className="p-10 bg-gray-100 border-2 border-orange-400">
                <div className="text-3xl font-bold pb-4">Profile</div>
                <div className="text-lg pb-4">Welcome, User!</div>
                {user && user.email && <div className="text-lg">Email: {user.email}</div>}
            </div>
        </div>
    )

}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch('http://localhost:3000/api/auth/session', {
        method: 'GET',
        headers: {
            'Authorization': context.req.cookies.Authorization || '',
        },
    });

    const data = await res.json();
    if (!res.ok) {
        return {
            props: {
                user: null,
                isAuthenticated: false
            }
        }
    }
    return {
        props: {
            user: data,
            isAuthenticated: true
        }
    }
}