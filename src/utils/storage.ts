// This utility function handles local storage operations for saving and retrieving tournament data.

export const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const clearLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const fetchTournaments = async () => {
    const data = getFromLocalStorage('tournaments');
    return data || [];
};

export const updateTournament = async (tournamentId: string, results: any) => {
    const tournaments = await fetchTournaments();
    const updated = tournaments.map((t: any) => 
        t.id === tournamentId ? { ...t, ...results } : t
    );
    saveToLocalStorage('tournaments', updated);
    return updated.find((t: any) => t.id === tournamentId);
};

// Export all tournament data to a JSON file
export const exportToFile = () => {
    const tournaments = getFromLocalStorage('tournaments');
    const dataStr = JSON.stringify(tournaments || [], null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pokemon-tournament-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Import tournament data from a JSON file
export const importFromFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                saveToLocalStorage('tournaments', data);
                resolve(data);
            } catch (error) {
                reject(new Error('File non valido. Assicurati che sia un file JSON corretto.'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Errore nella lettura del file.'));
        };
        
        reader.readAsText(file);
    });
};