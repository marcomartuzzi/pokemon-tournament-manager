import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authorizedUsers } from '../data/initialData';

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
            // Verifica credenziali dalla lista utenti autorizzati
            const foundUser = authorizedUsers.find(
                u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
            );
            
            if (foundUser) {
                contextLogin(foundUser.username);
                setError(null);
            } else {
                throw new Error('Username o password non corretti');
            }
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