import { Match } from '../types/match';

/**
 * Interfaccia per le statistiche di un partecipante
 */
interface ParticipantStats {
    wins: number;
    losses: number;
}

/**
 * Tipo mappa per le statistiche indicizzate per nome partecipante
 */
type StatsMap = Record<string, ParticipantStats>;

/**
 * Interfaccia per il record della leaderboard
 */
interface LeaderboardRecord {
    participant: string;
    wins: number;
    losses: number;
    winRatio: number;
}

/**
 * Calcola statistiche vittorie/sconfitte da un array di partite
 * @param matches - Array di partite da analizzare
 * @returns Mappa di statistiche per partecipante
 */
export const calculateWinLossStats = (matches: Match[]): StatsMap => {
    const stats: StatsMap = {};

    matches.forEach(match => {
        // Salta partite senza vincitore
        if (!match.winner) return;

        const winner = match.winner;
        const loser = match.participant1 === winner ? match.participant2 : match.participant1;

        if (!stats[winner]) {
            stats[winner] = { wins: 0, losses: 0 };
        }
        if (!stats[loser]) {
            stats[loser] = { wins: 0, losses: 0 };
        }

        stats[winner].wins += 1;
        stats[loser].losses += 1;
    });

    return stats;
};

/**
 * Genera classifica ordinata dalle statistiche
 * @param stats - Mappa di statistiche dei partecipanti
 * @returns Array di record ordinati per numero di vittorie (decrescente)
 */
export const calculateLeaderboard = (stats: StatsMap): LeaderboardRecord[] => {
    return Object.entries(stats)
        .map(([participant, record]): LeaderboardRecord => ({
            participant,
            wins: record.wins,
            losses: record.losses,
            winRatio: record.wins / (record.wins + record.losses) || 0
        }))
        .sort((a, b) => b.wins - a.wins);
};
