import React from 'react';
import { Link } from 'react-router-dom';
import { useTournamentContext } from '../context/TournamentContext';
import { energyImageMap } from '../utils/energyImages';

const Tournaments: React.FC = () => {
    const { tournaments } = useTournamentContext();

    return (
        <div style={{ padding: '0 20px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>🏆 Lista Tornei</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px'
            }}>
                {tournaments.map(tournament => {
                    const played = tournament.matches.filter(m => m.winner !== '').length;
                    const total = tournament.matches.length;
                    const winner = (() => {
                        if (played < total) return null;
                        const wins: { [key: string]: number } = {};
                        tournament.matches.forEach(m => {
                            if (m.winner) wins[m.winner] = (wins[m.winner] || 0) + 1;
                        });
                        const sorted = Object.entries(wins).sort((a, b) => b[1] - a[1]);
                        if (sorted.length === 0) return null;
                        if (sorted.length >= 2 && sorted[0][1] === sorted[1][1]) {
                            return tournament.tiebreaker?.winner || null;
                        }
                        return sorted[0][0];
                    })();

                    return (
                        <Link
                            key={tournament.id}
                            to={`/tournament/${tournament.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                padding: '16px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                            }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img
                                        src={import.meta.env.BASE_URL + tournament.badgeImage}
                                        alt={tournament.name}
                                        style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{tournament.name}</div>
                                        <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {energyImageMap[tournament.energia]
                                                ? <img src={import.meta.env.BASE_URL + energyImageMap[tournament.energia]} alt={tournament.energia} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                                : '⚡'
                                            }
                                            {tournament.energia}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', color: '#555' }}>
                                    <div>🏛️ {tournament.gym}</div>
                                    <div>👤 {tournament.leader}</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '13px',
                                    borderTop: '1px solid #eee',
                                    paddingTop: '8px'
                                }}>
                                    <span>🎯 {played}/{total} partite</span>
                                    {winner && (
                                        <span style={{ color: '#e65100', fontWeight: 'bold' }}>🏆 {winner}</span>
                                    )}
                                    {!winner && played === total && (
                                        <span style={{ color: '#e65100' }}>⚔️ Spareggio</span>
                                    )}
                                    {played > 0 && played < total && (
                                        <span style={{ color: '#1565C0' }}>In corso...</span>
                                    )}
                                    {played === 0 && (
                                        <span style={{ color: '#aaa' }}>Non iniziato</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Tournaments;
