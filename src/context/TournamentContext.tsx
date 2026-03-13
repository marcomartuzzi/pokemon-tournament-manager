import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Tournament } from '../types/tournament';
import { Match } from '../types/match';
import { Participant } from '../types/participant';
import { initialData } from '../data/initialData';

interface TournamentContextType {
    tournaments: Tournament[];
    loading: boolean;
    addTournament: (tournament: Tournament) => void;
    updateMatchResult: (tournamentId: string, matchId: string, result: Match) => void;
    resetTournament: (tournamentId: string) => void;
    resetAllTournaments: () => Promise<void>;
    updateTiebreaker: (tournamentId: string, tiebreaker: { participant1: string; participant2: string; winner: string } | null) => void;
    getLeaderboard: () => Participant[];
}

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

interface TournamentProviderProps {
    children: ReactNode;
}

/** Salva un singolo torneo su Firestore (fire-and-forget).
 *  JSON round-trip rimuove i campi `undefined` che Firestore rifiuta. */
const saveTournament = (tournament: Tournament) => {
    const data = JSON.parse(JSON.stringify(tournament));
    setDoc(doc(db, 'tournaments', tournament.id), data).catch(console.error);
};

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'tournaments'));
                let data = snapshot.docs.map(d => d.data() as Tournament);

                // Se Firestore è vuoto, inserisce i dati iniziali (primo avvio)
                if (data.length === 0) {
                    const batch = writeBatch(db);
                    initialData.tournaments.forEach(t => {
                        batch.set(doc(db, 'tournaments', t.id), t);
                    });
                    await batch.commit();
                    data = initialData.tournaments as Tournament[];
                }

                setTournaments(data);
            } catch (err) {
                console.error('Firestore non raggiungibile, uso dati locali:', err);
                setTournaments(initialData.tournaments as Tournament[]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const addTournament = (tournament: Tournament) => {
        setTournaments(prev => [...prev, tournament]);
        saveTournament(tournament);
    };

    const updateMatchResult = (tournamentId: string, matchId: string, result: Match) => {
        setTournaments(prev => {
            const updated = prev.map(t =>
                t.id === tournamentId
                    ? { ...t, matches: t.matches.map(m => m.id === matchId ? result : m) }
                    : t
            );
            const changed = updated.find(t => t.id === tournamentId);
            if (changed) saveTournament(changed);
            return updated;
        });
    };

    const resetTournament = (tournamentId: string) => {
        setTournaments(prev => {
            const updated = prev.map(t =>
                t.id === tournamentId
                    ? { ...t, tiebreaker: undefined, matches: t.matches.map(m => ({ ...m, winner: '' })) }
                    : t
            );
            const changed = updated.find(t => t.id === tournamentId);
            if (changed) saveTournament(changed);
            return updated;
        });
    };

    const resetAllTournaments = async () => {
        const batch = writeBatch(db);
        (initialData.tournaments as Tournament[]).forEach(t => {
            const data = JSON.parse(JSON.stringify(t));
            batch.set(doc(db, 'tournaments', t.id), data);
        });
        await batch.commit();
        setTournaments(initialData.tournaments as Tournament[]);
    };

    const updateTiebreaker = (tournamentId: string, tiebreaker: { participant1: string; participant2: string; winner: string } | null) => {
        setTournaments(prev => {
            const updated = prev.map(t =>
                t.id === tournamentId
                    ? { ...t, tiebreaker: tiebreaker ?? undefined }
                    : t
            );
            const changed = updated.find(t => t.id === tournamentId);
            if (changed) saveTournament(changed);
            return updated;
        });
    };

    const getLeaderboard = (): Participant[] => {
        const leaderboard: Record<string, number> = {};
        tournaments.forEach(t => {
            t.matches.forEach(m => {
                if (m.winner) leaderboard[m.winner] = (leaderboard[m.winner] || 0) + 1;
            });
        });
        return Object.entries(leaderboard)
            .map(([participant, wins]): Participant => ({
                id: participant.toLowerCase(),
                name: participant,
                wins,
                losses: 0,
            }))
            .sort((a, b) => b.wins - a.wins);
    };

    return (
        <TournamentContext.Provider value={{ tournaments, loading, addTournament, updateMatchResult, resetTournament, resetAllTournaments, updateTiebreaker, getLeaderboard }}>
            {children}
        </TournamentContext.Provider>
    );
};

export const useTournamentContext = () => {
    const context = React.useContext(TournamentContext);
    if (!context) {
        throw new Error('useTournamentContext must be used within a TournamentProvider');
    }
    return context;
};