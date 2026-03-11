import React from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '0 20px 20px' }}>
            {user ? (
                <Leaderboard />
            ) : (
                <p>Accedi per visualizzare la classifica generale.</p>
            )}
        </div>
    );
};

export default Dashboard;