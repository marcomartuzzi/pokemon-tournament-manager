import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Tournament } from '../types/tournament';
import { Match } from '../types/match';
import { Participant } from '../types/participant';
import { initialData } from '../data/initialData';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

/**
 * Tipo per il contesto dei tornei
 * @interface TournamentContextType
 */
interface TournamentContextType {
    /** Array di tutti i tornei */
    tournaments: Tournament[];
    /** Aggiungi un nuovo torneo */
    addTournament: (tournament: Tournament) => void;
    /** Aggiorna il risultato di una partita */
    updateMatchResult: (tournamentId: string, matchId: string, result: Match) => void;
    /** Azzera tutti i risultati di un torneo */
    resetTournament: (tournamentId: string) => void;
    /** Imposta o rimuove lo spareggio di un torneo */
    updateTiebreaker: (tournamentId: string, tiebreaker: { participant1: string; participant2: string; winner: string } | null) => void;
    /** Ottieni la classifica generale (tutti i tornei) */
    getLeaderboard: () => Participant[];
}

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

interface TournamentProviderProps {
    children: ReactNode;
}

/**
 * Provider per il contesto dei tornei
 * Gestisce lo stato globale dei tornei e la sincronizzazione con localStorage
 * Segue best practices React: TypeScript, hooks, memoization
 */
export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
    // Carica i dati dal localStorage o usa i dati iniziali
    const [tournaments, setTournaments] = useState<Tournament[]>(() => {
        const saved = getFromLocalStorage('tournaments');
        return saved && saved.length > 0 ? saved : initialData.tournaments;
    });

    // Salva i dati nel localStorage quando cambiano
    useEffect(() => {
        saveToLocalStorage('tournaments', tournaments);
    }, [tournaments]);

    /**
     * Aggiungi un nuovo torneo
     * @param tournament - Il torneo da aggiungere
     */
    const addTournament = (tournament: Tournament) => {
        setTournaments((prev) => [...prev, tournament]);
    };

    /**
     * Aggiorna il risultato di una partita specifica
     * @param tournamentId - ID del torneo
     * @param matchId - ID della partita
     * @param result - Oggetto Match aggiornato
     */
    const updateMatchResult = (tournamentId: string, matchId: string, result: Match) => {
        setTournaments((prev) =>
            prev.map((tournament) =>
                tournament.id === tournamentId
                    ? {
                          ...tournament,
                          matches: tournament.matches.map((match) =>
                              match.id === matchId ? result : match
                          ),
                      }
                    : tournament
            )
        );
    };

    /**
     * Calcola la classifica generale sommando vittorie da tutti i tornei
     * @returns Array di partecipanti ordinati per numero di vittorie (decrescente)
     */
    /**
     * Azzera tutti i risultati (winner) delle partite di un torneo
     * @param tournamentId - ID del torneo da resettare
     */
    const resetTournament = (tournamentId: string) => {
        setTournaments((prev) =>
            prev.map((tournament) =>
                tournament.id === tournamentId
                    ? {
                          ...tournament,
                          tiebreaker: undefined,
                          matches: tournament.matches.map((match) => ({ ...match, winner: '' })),
                      }
                    : tournament
            )
        );
    };

    const updateTiebreaker = (tournamentId: string, tiebreaker: { participant1: string; participant2: string; winner: string } | null) => {
        setTournaments((prev) =>
            prev.map((tournament) =>
                tournament.id === tournamentId
                    ? { ...tournament, tiebreaker: tiebreaker ?? undefined }
                    : tournament
            )
        );
    };

    const getLeaderboard = (): Participant[] => {
        const leaderboard: Record<string, number> = {};
        
        tournaments.forEach((tournament) => {
            tournament.matches.forEach((match) => {
                if (match.winner) {
                    leaderboard[match.winner] = (leaderboard[match.winner] || 0) + 1;
                }
            });
        });
        
        return Object.entries(leaderboard)
            .map(([participant, wins]): Participant => ({ 
                id: participant.toLowerCase(), 
                name: participant, 
                wins, 
                losses: 0 // TODO: calcolare anche le sconfitte
            }))
            .sort((a, b) => b.wins - a.wins);
    };

    return (
        <TournamentContext.Provider value={{ tournaments, addTournament, updateMatchResult, resetTournament, updateTiebreaker, getLeaderboard }}>
            {children}
        </TournamentContext.Provider>
    );
};

/**
 * Hook personalizzato per accedere al contesto dei tornei
 * Garantisce che il contesto sia usato all'interno del provider
 * @throws {Error} Se usato fuori dal TournamentProvider
 * @returns Il contesto dei tornei
 */
export const useTournamentContext = () => {
    const context = React.useContext(TournamentContext);
    if (!context) {
        throw new Error('useTournamentContext must be used within a TournamentProvider');
    }
    return context;
};