import { GetServerSideProps } from "next";

export const getAuthServerSideProps: GetServerSideProps = async (context) => {
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