import { GetServerSideProps } from "next";
import { User } from "@/types/users";

export default function ProfilePage({ user, isAuthenticated }: { user: User, isAuthenticated: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center vertical-padding">
            <div className="bg-gray-100">
                <div className="flex flex-col items-center justify-center p-4">
                    <div className="text-3xl font-bold">Profile</div>
                    <div className="text-lg">Welcome, User!</div>
                    {user && user.email && <div className="text-lg">Email: {user.email}</div>}
                </div>
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