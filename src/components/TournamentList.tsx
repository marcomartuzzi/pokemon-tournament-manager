import React from 'react';
import { useTournaments } from '../hooks/useTournaments';
import { Link } from 'react-router-dom';

const TournamentList: React.FC = () => {
    const { tournaments } = useTournaments();

    return (
        <div>
            <h2>Lista Tornei</h2>
            <ul>
                {tournaments.map(tournament => (
                    <li key={tournament.id}>
                        <Link to={`/tournament/${tournament.id}`}>
                            {tournament.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export { TournamentList };