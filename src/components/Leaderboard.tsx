import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTournamentContext } from '../context/TournamentContext';

const Leaderboard: React.FC = () => {
    const { tournaments } = useTournamentContext();
    const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);

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
            {/* Lightbox overlay */}
            {lightbox && (
                <div
                    onClick={() => setLightbox(null)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'zoom-out',
                    }}
                >
                    <img
                        src={lightbox.url}
                        alt={lightbox.name}
                        style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                    />
                </div>
            )}
            <h2>Medagliere</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {participantBadges.map(({ participant, wonTournaments }) => {
                    const avatarUrl = import.meta.env.BASE_URL + 'avatars/' + participant.toLowerCase() + '.png';
                    return (
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
                        <img
                            src={avatarUrl}
                            alt={participant}
                            onClick={() => setLightbox({ url: avatarUrl, name: participant })}
                            onError={e => {
                                const el = e.currentTarget;
                                el.style.display = 'none';
                                const sibling = el.nextElementSibling as HTMLElement;
                                if (sibling) sibling.style.display = 'flex';
                            }}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #e0e0e0',
                                flexShrink: 0,
                                cursor: 'zoom-in',
                            }}
                        />
                        {/* Fallback iniziali se l'immagine non esiste */}
                        <div style={{
                            display: 'none',
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: '#667eea',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '22px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: '2px solid #e0e0e0',
                        }}>
                            {participant.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '70px' }}>
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
                    </div>
                    );
                })}
            </div>
        </div>
    );
};

export { Leaderboard };