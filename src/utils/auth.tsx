import { GetServerSideProps } from "next";

export const getAuthServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/session`, {
        method: 'GET',
        headers: {
            'Authorization': context.req.cookies.Authorization || '',
        },
    });

    if (!res.ok) {
        return {
            props: {
                user: null,
                isAuthenticated: false
            }
        }
    }

    const data = await res.json();
    return {
        props: {
            user: data,
            isAuthenticated: true
        }
    }
}