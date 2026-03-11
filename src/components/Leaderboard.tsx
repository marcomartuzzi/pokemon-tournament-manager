import React from 'react';
import { Link } from 'react-router-dom';
import { useTournamentContext } from '../context/TournamentContext';

const Leaderboard: React.FC = () => {
    const { tournaments } = useTournamentContext();

    // Collect all unique participants
    const allParticipants: string[] = [];
    tournaments.forEach(t => {
        t.participants.forEach(p => {
            if (!allParticipants.includes(p)) allParticipants.push(p);
        });
    });

    // For each tournament, determine the winner (most match wins; null if not all played or unresolved tie)
    const tournamentWinners: { [tournamentId: string]: string | null } = {};
    tournaments.forEach(tournament => {
        const wins: { [p: string]: number } = {};
        tournament.matches.forEach(m => {
            if (m.winner) wins[m.winner] = (wins[m.winner] || 0) + 1;
        });
        const allPlayed = tournament.matches.every(m => m.winner !== '');
        if (!allPlayed) {
            tournamentWinners[tournament.id] = null;
        } else {
            const sorted = Object.entries(wins).sort((a, b) => b[1] - a[1]);
            if (sorted.length === 0) {
                tournamentWinners[tournament.id] = null;
            } else if (sorted.length >= 2 && sorted[0][1] === sorted[1][1]) {
                // Tie at the top: use tiebreaker if available
                tournamentWinners[tournament.id] = tournament.tiebreaker?.winner || null;
            } else {
                tournamentWinners[tournament.id] = sorted[0][0];
            }
        }
    });

    // For each participant, collect the tournaments they won
    const participantBadges: { participant: string; wonTournaments: typeof tournaments }[] = allParticipants.map(p => ({
        participant: p,
        wonTournaments: tournaments.filter(t => tournamentWinners[t.id] === p),
    }));

    // Sort by number of badges won descending, then alphabetically
    participantBadges.sort((a, b) =>
        b.wonTournaments.length - a.wonTournaments.length ||
        a.participant.localeCompare(b.participant)
    );

    return (
        <div className="leaderboard">
            <h2>Classifica</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {participantBadges.map(({ participant, wonTournaments }) => (
                    <div
                        key={participant}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 16px',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            border: '1px solid #eee',
                        }}
                    >
                        <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '80px' }}>
                            {participant}
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
                            {wonTournaments.length === 0 ? (
                                <span style={{ fontSize: '13px', color: '#bbb' }}>Nessuna medaglia</span>
                            ) : (
                                wonTournaments.map(t => (
                                    <Link
                                        key={t.id}
                                        to={`/tournament/${t.id}`}
                                        title={t.name}
                                        style={{ display: 'inline-block', lineHeight: 0 }}
                                    >
                                        <img
                                            src={import.meta.env.BASE_URL + t.badgeImage}
                                            alt={t.name}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                objectFit: 'contain',
                                                transition: 'transform 0.15s ease',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.25)')}
                                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                        />
                                    </Link>
                                ))
                            )}
                        </div>
                        <span style={{
                            minWidth: '24px',
                            textAlign: 'right',
                            fontSize: '14px',
                            color: '#555',
                            fontWeight: '600',
                        }}>
                            {wonTournaments.length > 0 ? `🏅 ${wonTournaments.length}` : ''}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { Leaderboard };