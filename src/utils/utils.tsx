import { serialize } from 'cookie';
import { NextApiResponse } from 'next';

export const setAuthorizationCookie = (res: NextApiResponse, accessToken: string) => {
    const cookie = serialize(
        'Authorization', `Bearer ${accessToken}`,
        {
            httpOnly: true,
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
        }
    );
    res.setHeader('Set-Cookie', cookie)
}

export const getAuthHeaderForToken = (accessToken?: string) => {
    if (!accessToken) {
        return {}
    }

    return { 'Authorization': accessToken }
}