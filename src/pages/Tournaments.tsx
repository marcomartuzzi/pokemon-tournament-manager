import React from 'react';
import { Link } from 'react-router-dom';
import { useTournamentContext } from '../context/TournamentContext';
import { energyImageMap } from '../utils/energyImages';

const Tournaments: React.FC = () => {
    const { tournaments } = useTournamentContext();

    return (
        <div style={{ padding: '0 20px 20px' }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,58,112,0.12)',
                borderTop: '4px solid #FFCB05',
                padding: '20px',
            }}>
                <h2 style={{
                    margin: '0 0 20px',
                    color: '#003A70',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '13px',
                    letterSpacing: '1px',
                }}>Lista Tornei</h2>
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
                                border: '1px solid #d0e4f7',
                                borderLeft: '4px solid #3D7DCA',
                                borderRadius: '10px',
                                padding: '16px',
                                backgroundColor: '#f7fbff',
                                boxShadow: '0 2px 6px rgba(0,58,112,0.07)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(-3px)';
                                el.style.boxShadow = '0 6px 18px rgba(0,58,112,0.18)';
                                el.style.borderColor = '#FFCB05';
                                el.style.borderLeftColor = '#FFCB05';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(0)';
                                el.style.boxShadow = '0 2px 6px rgba(0,58,112,0.07)';
                                el.style.borderColor = '#d0e4f7';
                                el.style.borderLeftColor = '#3D7DCA';
                            }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img
                                        src={import.meta.env.BASE_URL + tournament.badgeImage}
                                        alt={tournament.name}
                                        style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '15px', color: '#003A70' }}>{tournament.name}</div>
                                        <div style={{ fontSize: '13px', color: '#3D7DCA', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
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
                                    borderTop: '1px solid #d0e4f7',
                                    paddingTop: '8px',
                                    fontWeight: '600',
                                }}>
                                    <span style={{ color: '#003A70' }}>🎯 {played}/{total} partite</span>
                                    {winner && (
                                        <span style={{ color: '#CC0000', fontWeight: 'bold' }}>🏆 {winner}</span>
                                    )}
                                    {!winner && played === total && (
                                        <span style={{ color: '#CC0000' }}>⚔️ Spareggio</span>
                                    )}
                                    {played > 0 && played < total && (
                                        <span style={{ color: '#3D7DCA' }}>In corso...</span>
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
        </div>
    );
};

export default Tournaments;
