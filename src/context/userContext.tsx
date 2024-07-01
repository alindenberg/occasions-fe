import { User } from '@/types/users';
import { createContext, useState, useEffect } from 'react';

interface UserContextType {
    user: User | null;
    setUser: any;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data here and set it to the state
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        // Fetch user data from your API
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const data = await response.json();
        if (!response.ok) {
            return setUser(null);
        }

        setUser(data);
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;