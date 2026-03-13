import { useState, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    const { user, login: contextLogin, logout: contextLogout } = context;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const userDoc = await getDoc(doc(db, 'users', username.toLowerCase()));
            if (!userDoc.exists()) throw new Error('Username o password non corretti');
            const foundUser = userDoc.data();
            if (foundUser.password !== password) throw new Error('Username o password non corretti');
            contextLogin(foundUser.username, foundUser.isAdmin ?? false, foundUser.displayName ?? username);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        contextLogout();
    };

    return { user, login, logout, loading, error };
};

export { useAuth };