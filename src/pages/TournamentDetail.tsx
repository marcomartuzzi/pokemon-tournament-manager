import React, { useContext, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TournamentContext } from '../context/TournamentContext';

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
        return participants
            .map(p => ({
                name: p,
                wins: stats[p].wins,
                losses: stats[p].losses
            }))
            .sort((a, b) => b.wins - a.wins);
    }, [participants, stats]);

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
                    <div style={{ marginBottom: '8px' }}>
                        <dt style={{ display: 'inline', fontWeight: 'bold' }}>⚡ Energia:</dt>
                        <dd style={{ display: 'inline', marginLeft: '8px' }}>{tournament.energia}</dd>
                    </div>
                </dl>
                {tournament.badgeImage && (
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>🏅 Medaglia:</p>
                        <img 
                            src={tournament.badgeImage} 
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
                    {leaderboard.map((player, index) => (
                        <div 
                            key={player.name}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 15px',
                                marginBottom: index < leaderboard.length - 1 ? '10px' : '0',
                                backgroundColor: index === 0 ? '#fff9c4' : '#f5f5f5',
                                borderRadius: '6px',
                                border: index === 0 ? '2px solid #fbc02d' : '1px solid #e0e0e0'
                            }}
                        >
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginRight: '15px',
                                minWidth: '30px',
                                color: index === 0 ? '#f57c00' : '#9e9e9e'
                            }}>
                                {index === 0 ? '🏆' : `${index + 1}°`}
                            </span>
                            <span style={{
                                flex: 1,
                                fontSize: '18px',
                                fontWeight: index === 0 ? 'bold' : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {player.name}
                                {index === 0 && tournament.badgeImage && (
                                    <img
                                        src={tournament.badgeImage}
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
                    ))}
                </div>
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