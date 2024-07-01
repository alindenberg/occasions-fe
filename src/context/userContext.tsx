import { createContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

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

        setUser(data);
    };

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;