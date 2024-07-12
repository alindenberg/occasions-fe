import { User } from '@/types/users';
import { createContext, useState, useEffect } from 'react';

interface UserContextType {
    user: User | null;
    setUser: any;
    purchaseCredits: (quantity: number) => void;
}

const UserContext = createContext<UserContextType | null>({
    user: null,
    setUser: () => { },
    purchaseCredits: (quantity: number) => {
        return null;
    }
});

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data here and set it to the state
        fetchUserData();
    }, [children]);

    const fetchUserData = async () => {
        try {
            // Fetch user data from your API
            const response = await fetch('/api/auth/session', { credentials: 'include' });
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch user data');

            setUser(data);
        } catch (error) {
            console.error(error);
            setUser(null);
        }
    };

    const purchaseCredits = (quantity: number) => {
        // Implement the logic to purchase credits
        console.log(`Purchasing ${quantity} credits for user ${user?.email}`);
        // Example: Call an API to purchase credits
        // fetch('/api/purchase-credits', { method: 'POST', body: JSON.stringify({ userId: user?.id, quantity }) });
    };

    return (
        <UserContext.Provider value={{ user, setUser, purchaseCredits }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;