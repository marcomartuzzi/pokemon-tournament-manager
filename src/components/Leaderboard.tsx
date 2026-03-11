import React from 'react';
import { useTournamentContext } from '../context/TournamentContext';
import { Participant } from '../types/participant';

const Leaderboard: React.FC = () => {
    const { tournaments } = useTournamentContext();

    const calculateLeaderboard = () => {
        const participantWins: { [key: string]: number } = {};

        tournaments.forEach(tournament => {
            tournament.matches.forEach(match => {
                if (match.winner) {
                    participantWins[match.winner] = (participantWins[match.winner] || 0) + 1;
                }
            });
        });

        return Object.entries(participantWins)
            .map(([participant, wins]) => ({ participant, wins }))
            .sort((a, b) => b.wins - a.wins);
    };

    const leaderboard = calculateLeaderboard();

    return (
        <div className="leaderboard">
            <h2>Classifica</h2>
            <table>
                <thead>
                    <tr>
                        <th>Partecipante</th>
                        <th>Vittorie</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map(({ participant, wins }) => (
                        <tr key={participant}>
                            <td>{participant}</td>
                            <td>{wins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { Leaderboard };