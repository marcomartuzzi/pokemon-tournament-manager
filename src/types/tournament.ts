export interface Tournament {
    id: string;
    name: string;
    participants: string[];
    matches: Match[];
    energia: string;
    badgeImage?: string;
    gym?: string;
    leader?: string;
    results?: {
        [participantId: string]: {
            wins: number;
            losses: number;
        };
    };
}

export interface Match {
    id: string;
    participant1: string;
    participant2: string;
    winner?: string;
}