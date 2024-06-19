import { serialize } from 'cookie';
import { NextApiResponse } from 'next';

export const setAuthorizationCookie = (res: NextApiResponse, access_token: string) => {
    const cookie = serialize(
        'Authorization', `Bearer ${access_token}`,
        {
            httpOnly: true,
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
        }
    );
    res.setHeader('Set-Cookie', cookie)
}