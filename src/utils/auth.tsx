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
            redirect: {
                destination: `/login?redirect=${context.req.url}`,
                permanent: false
            }
        }
    }

    const data = await res.json();
    return {
        props: {
            user: data
        }
    }
}