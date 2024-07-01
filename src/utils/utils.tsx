import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

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

export const getAuthHeaders = (req: NextApiRequest) => {
    return {
        'Authorization':
            req.cookies?.['Authorization']
            || req.headers?.['authorization']
            || ''
    };
}

export function getLocalizedDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
}