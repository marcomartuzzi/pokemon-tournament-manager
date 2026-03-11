import React, { useContext, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TournamentContext } from '../context/TournamentContext';
import { useTournamentContext } from '../context/TournamentContext';
import { energyImageMap } from '../utils/energyImages';

interface PlayerStats {
  wins: number;
  losses: number;
}

type StatsMap = Record<string, PlayerStats>;

/**
 * Componente per visualizzare i dettagli di un torneo con tabella risultati interattiva
 * Segue best practices React: TypeScript, accessibility, performance optimization
 */
const TournamentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const context = useContext(TournamentContext);

    if (!context) {
        return (
            <div role="status" aria-live="polite" style={{ padding: '20px' }}>
                Caricamento...
            </div>
        );
    }

    const { tournaments, updateMatchResult } = context;
    const { updateTiebreaker } = useTournamentContext();
    const tournament = tournaments.find(t => t.id === id);

    if (!tournament) {
        return (
            <div role="alert" style={{ padding: '20px' }}>
                <h2>Torneo non trovato</h2>
                <p>Il torneo richiesto non esiste o è stato rimosso.</p>
            </div>
        );
    }

    const participants = tournament.participants;

    // Memoizza la funzione di ricerca risultato (performance optimization)
    const getMatchResult = useCallback((player1: string, player2: string): string => {
        if (player1 === player2) return '/';
        
        const match = tournament.matches.find(
            m => (m.participant1 === player1 && m.participant2 === player2) ||
                 (m.participant1 === player2 && m.participant2 === player1)
        );

        if (!match || !match.winner) return '';
        
        // Restituisce 1 se player1 ha vinto, 0 se ha perso
        return match.winner === player1 ? '1' : '0';
    }, [tournament.matches]);

    // Memoizza handler (evita re-creazione ad ogni render)
    const handleResultChange = useCallback((player1: string, player2: string, value: string) => {
        if (player1 === player2) return;
        if (value !== '0' && value !== '1' && value !== '') return;

        const match = tournament.matches.find(
            m => (m.participant1 === player1 && m.participant2 === player2) ||
                 (m.participant1 === player2 && m.participant2 === player1)
        );

        if (!match) return;

        let winner = '';
        if (value === '1') {
            winner = player1;
        } else if (value === '0') {
            winner = player2;
        }

        const updatedMatch = { ...match, winner };
        updateMatchResult(tournament.id, match.id, updatedMatch);
    }, [tournament.id, tournament.matches, updateMatchResult]);

    // Memoizza calcolo statistiche (performance optimization)
    const stats = useMemo((): StatsMap => {
        const statsMap: StatsMap = {};
        participants.forEach(p => {
            statsMap[p] = { wins: 0, losses: 0 };
        });

        tournament.matches.forEach(match => {
            if (match.winner) {
                statsMap[match.winner].wins++;
                const loser = match.participant1 === match.winner ? match.participant2 : match.participant1;
                statsMap[loser].losses++;
            }
        });

        return statsMap;
    }, [participants, tournament.matches]);

    // Memoizza classifica ordinata per vittorie (performance optimization)
    const leaderboard = useMemo(() => {
        const sorted = participants
            .map(p => ({
                name: p,
                wins: stats[p].wins,
                losses: stats[p].losses
            }))
            .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));

        // Se c'è uno spareggio impostato, il vincitore sale in prima posizione
        if (tournament.tiebreaker?.winner) {
            const tbWinner = tournament.tiebreaker.winner;
            const idx = sorted.findIndex(p => p.name === tbWinner);
            if (idx > 0) {
                const [winner] = sorted.splice(idx, 1);
                sorted.unshift(winner);
            }
        }
        return sorted;
    }, [participants, stats, tournament.tiebreaker]);

    const allPlayed = tournament.matches.every(m => m.winner !== '');

    // Rileva giocatori in parità in cima (solo quando tutte le partite sono giocate)
    const tiedTopPlayers = useMemo(() => {
        if (!allPlayed) return [];
        if (leaderboard.length < 2) return [];
        // Se c'è già uno spareggio impostato, non mostrare più il selettore
        if (tournament.tiebreaker?.winner) return [];
        const topWins = leaderboard[0].wins;
        const tied = leaderboard.filter(p => p.wins === topWins);
        return tied.length >= 2 ? tied : [];
    }, [allPlayed, leaderboard, tournament.tiebreaker]);

    return (
        <main style={{ padding: '20px' }} aria-labelledby="tournament-title">
            <h1 id="tournament-title">{tournament.name}</h1>
            
            {/* Info Torneo */}
            <section 
                aria-labelledby="tournament-info"
                style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '20px' 
                }}
            >
                <h2 id="tournament-info" className="sr-only">Informazioni Torneo</h2>
                <dl style={{ margin: 0 }}>
                    <div style={{ marginBottom: '8px' }}>
                        <dt style={{ display: 'inline', fontWeight: 'bold' }}>🏛️ Palestra:</dt>
                        <dd style={{ display: 'inline', marginLeft: '8px' }}>{tournament.gym}</dd>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <dt style={{ display: 'inline', fontWeight: 'bold' }}>👤 Capopalestra:</dt>
                        <dd style={{ display: 'inline', marginLeft: '8px' }}>{tournament.leader}</dd>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <dt style={{ fontWeight: 'bold' }}>⚡ Energia:</dt>
                        <dd style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {energyImageMap[tournament.energia] && (
                                <img
                                    src={import.meta.env.BASE_URL + energyImageMap[tournament.energia]}
                                    alt={tournament.energia}
                                    style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                                />
                            )}
                            {tournament.energia}
                        </dd>
                    </div>
                </dl>
                {tournament.badgeImage && (
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>🏅 Medaglia:</p>
                        <img 
                            src={import.meta.env.BASE_URL + tournament.badgeImage} 
                            alt={`Medaglia ${tournament.name}`}
                            style={{ 
                                width: '120px', 
                                height: 'auto',
                                display: 'block',
                                marginTop: '10px',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                backgroundColor: 'white'
                            }}
                        />
                    </div>
                )}
            </section>

            {/* Tabella Risultati */}
            <section aria-labelledby="results-table">
                <h2 id="results-table">Tabella Risultati</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    Inserisci 1 per vittoria, 0 per sconfitta
                </p>
                
                <table 
                    style={{ 
                        borderCollapse: 'collapse', 
                        width: '100%', 
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}
                    aria-label="Matrice risultati partite"
                >
                    <thead>
                        <tr>
                            <th scope="col" style={cellStyle}></th>
                            {participants.map(p => (
                                <th key={p} scope="col" style={headerStyle}>{p}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(player1 => (
                            <tr key={player1}>
                                <th scope="row" style={rowHeaderStyle}>{player1}</th>
                                {participants.map(player2 => (
                                    <td key={player2} style={cellStyle}>
                                        {player1 === player2 ? (
                                            <span style={{ color: '#999' }} aria-label="Stesso giocatore">
                                                /
                                            </span>
                                        ) : (
                                            <input
                                                type="text"
                                                value={getMatchResult(player1, player2)}
                                                onChange={(e) => handleResultChange(player1, player2, e.target.value)}
                                                maxLength={1}
                                                aria-label={`Risultato partita ${player1} vs ${player2}`}
                                                placeholder="-"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    textAlign: 'center',
                                                    fontSize: '18px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Classifica Torneo */}
            <section 
                aria-labelledby="leaderboard-section"
                style={{ 
                    marginTop: '30px',
                    maxWidth: '600px',
                    margin: '30px auto 0'
                }}
            >
                <h2 id="leaderboard-section">🏆 Classifica Torneo</h2>
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {leaderboard.map((player, index) => {
                        // Prima posizione solo se non c'è parità irrisolta in cima
                        const isWinner = index === 0 && tiedTopPlayers.length === 0;
                        return (
                        <div 
                            key={player.name}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 15px',
                                marginBottom: index < leaderboard.length - 1 ? '10px' : '0',
                                backgroundColor: isWinner ? '#fff9c4' : '#f5f5f5',
                                borderRadius: '6px',
                                border: isWinner ? '2px solid #fbc02d' : '1px solid #e0e0e0'
                            }}
                        >
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginRight: '15px',
                                minWidth: '30px',
                                color: isWinner ? '#f57c00' : '#9e9e9e'
                            }}>
                                {isWinner ? '🏆' : `${index + 1}°`}
                            </span>
                            <span style={{
                                flex: 1,
                                fontSize: '18px',
                                fontWeight: isWinner ? 'bold' : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {player.name}
                                {isWinner && tournament.badgeImage && allPlayed && (
                                    <img
                                        src={import.meta.env.BASE_URL + tournament.badgeImage}
                                        alt={`Medaglia ${tournament.name}`}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            objectFit: 'contain',
                                            borderRadius: '4px'
                                        }}
                                    />
                                )}
                            </span>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: '#4caf50',
                                    marginRight: '10px'
                                }}>
                                    {player.wins} V
                                </span>
                                <span style={{
                                    fontSize: '16px',
                                    color: '#757575'
                                }}>
                                    {player.losses} S
                                </span>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* Sezione spareggio */}
                {tiedTopPlayers.length >= 2 && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px 20px',
                        backgroundColor: '#fff3e0',
                        border: '2px solid #ff9800',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ margin: '0 0 8px', color: '#e65100' }}>⚔️ Spareggio</h3>
                        <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#555' }}>
                            {tiedTopPlayers.map(p => p.name).join(' e ')} sono in parità con {tiedTopPlayers[0].wins} vittorie. Seleziona il vincitore dello spareggio:
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {tiedTopPlayers.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => updateTiebreaker(tournament.id, {
                                        participant1: tiedTopPlayers[0].name,
                                        participant2: tiedTopPlayers[1].name,
                                        winner: p.name
                                    })}
                                    style={{
                                        padding: '10px 22px',
                                        backgroundColor: '#ff9800',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e65100')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff9800')}
                                >
                                    🏆 {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Spareggio già assegnato: mostra il risultato con opzione di modifica */}
                {allPlayed && tournament.tiebreaker?.winner && (
                    <div style={{
                        marginTop: '20px',
                        padding: '12px 16px',
                        backgroundColor: '#e8f5e9',
                        border: '1px solid #a5d6a7',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <span style={{ fontSize: '14px', color: '#2e7d32' }}>
                            ⚔️ Spareggio vinto da <strong>{tournament.tiebreaker.winner}</strong>
                        </span>
                        <button
                            onClick={() => updateTiebreaker(tournament.id, null)}
                            style={{
                                padding: '4px 12px',
                                backgroundColor: 'transparent',
                                color: '#c62828',
                                border: '1px solid #c62828',
                                borderRadius: '4px',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                        >
                            Annulla
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
};

// Stili
const cellStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#2196F3',
    color: 'white',
    fontWeight: 'bold',
};

const rowHeaderStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#2196F3',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: '15px',
};

const totalHeaderStyle: React.CSSProperties = {
    ...cellStyle,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: '15px',
};

const totalCellStyle: React.CSSProperties = {
    ...cellStyle,
    fontSize: '16px',
};

export default TournamentDetail;