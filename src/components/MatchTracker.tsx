import React, { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';

const MatchTracker: React.FC = () => {
    const context = useContext(TournamentContext);
    
    if (!context) {
        return <div>Caricamento...</div>;
    }

    const { tournaments, updateMatchResult } = context;

    const handleMatchResult = (tournamentId: string, matchId: string, winner: string) => {
        // Trova il match e crea l'oggetto Match completo
        const tournament = tournaments.find(t => t.id === tournamentId);
        const match = tournament?.matches.find(m => m.id === matchId);
        
        if (match) {
            const updatedMatch = { ...match, winner };
            updateMatchResult(tournamentId, matchId, updatedMatch);
        }
    };

    return (
        <div>
            <h2>Tracker Partite</h2>
            {tournaments.map(tournament => (
                <div key={tournament.id}>
                    <h3>{tournament.name}</h3>
                    <ul>
                        {tournament.matches.map(match => (
                            <li key={match.id}>
                                {match.participant1} vs {match.participant2}
                                {!match.winner ? (
                                    <>
                                        <button onClick={() => handleMatchResult(tournament.id, match.id, match.participant1)}>
                                            Vincitore: {match.participant1}
                                        </button>
                                        <button onClick={() => handleMatchResult(tournament.id, match.id, match.participant2)}>
                                            Vincitore: {match.participant2}
                                        </button>
                                    </>
                                ) : (
                                    <span> - Vincitore: {match.winner}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export { MatchTracker };