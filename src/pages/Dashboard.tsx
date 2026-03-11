import React from 'react';
import { TournamentList } from '../components/TournamentList';
import { Leaderboard } from '../components/Leaderboard';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Benvenuto nel Gestore Tornei Pokémon</h1>
            {user ? (
                <>
                    <TournamentList />
                    <Leaderboard />
                </>
            ) : (
                <p>Accedi per visualizzare i tornei e la classifica.</p>
            )}
        </div>
    );
};

export default Dashboard;