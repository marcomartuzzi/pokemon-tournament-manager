# Pokemon Tournament Manager

## Panoramica
Applicazione web per gestire un torneo di carte Pokemon tra 4 giocatori su 8 palestre della regione di Kanto. Ogni torneo corrisponde a una palestra con il suo capopalestra, energia associata e medaglia da conquistare. L'applicazione traccia i risultati delle partite, calcola la classifica per ogni torneo e mostra la classifica generale.

## Funzionalita

- **Autenticazione utenti** - Login sicuro per i 4 partecipanti e l'amministratore.
- **8 Tornei / Palestre** - Uno per ogni medaglia di Kanto, ciascuno con energia, capopalestra e immagine della medaglia.
- **Tipo energia per torneo** - Ogni torneo ha un tipo Pokemon associato (Metallo, Acqua, Lampo, Erba, Psico, Oscurita, Fuoco, Lotta).
- **Tabella risultati interattiva** - Inserisci 1 per vittoria e 0 per sconfitta nella matrice partite.
- **Classifica torneo** - Mostra la classifica con la medaglia del torneo accanto al vincitore.
- **Classifica generale** - Sommatorio delle vittorie su tutti i tornei.
- **Backup & Sync** - Esporta/importa i dati in JSON per condividerli tra browser e dispositivi.
- **Reset tornei** - Azzera i risultati di un singolo torneo o di tutti i tornei dalla pagina Admin.
- **Interfaccia in italiano** - Tutta l'interfaccia e in italiano.

## Tornei disponibili

| # | Medaglia | Palestra | Capopalestra | Energia |
|---|---|---|---|---|
| 1 | Sasso | Plumbeopoli | Brock | Metallo |
| 2 | Cascata | Celestopoli | Misty | Acqua |
| 3 | Tuono | Aranciopoli | Lt. Surge | Lampo |
| 4 | Arcobaleno | Azzurropoli | Erika | Erba |
| 5 | Anima | Fucsiapoli | Koga | Psico |
| 6 | Palude | Zafferanopoli | Sabrina | Oscurita |
| 7 | Vulcano | Isola Cannella | Blaine | Fuoco |
| 8 | Terra | Smeraldopoli | Giovanni | Lotta |

## Partecipanti e credenziali

| Username | Password | Ruolo |
|---|---|---|
| admin | admin | Amministratore |
| marco | marco | Partecipante |
| luca | luca | Partecipante |
| gabriele | gabriele | Partecipante |
| jacopo | jacopo | Partecipante |

## Struttura del progetto

```
pokemon-tournament-manager
 src
    components
       ErrorBoundary.tsx
       Header.tsx
       TournamentList.tsx
       MatchTracker.tsx
       Leaderboard.tsx
       Login.tsx
    pages
       Dashboard.tsx
       TournamentDetail.tsx
       Admin.tsx
    hooks
       useTournaments.ts
       useAuth.ts
    context
       AuthContext.tsx
       TournamentContext.tsx
    types
       tournament.ts
       participant.ts
       match.ts
    utils
       storage.ts
    data
       initialData.ts
    App.tsx
    main.tsx
    index.css
 public
    badges/        <- immagini medaglie (sasso.png, cascata.png, ...)
 index.html
 package.json
 tsconfig.json
 vite.config.ts
```

## Avvio

```bash
# Installa le dipendenze
npm install

# Avvia in modalita sviluppo (http://localhost:3000)
npm run dev

# Build per produzione
npm run build
```

## Backup e Sincronizzazione

I dati sono salvati nel **localStorage** del browser. Per condividerli tra dispositivi:

### Esportare
1. Vai alla pagina **Admin**
2. Clicca **"Esporta Dati"**
3. Viene scaricato un file JSON (es. `pokemon-tournament-backup-2026-03-11.json`)

### Importare
1. Vai alla pagina **Admin** sul nuovo browser/PC
2. Clicca **"Importa Dati"**
3. Seleziona il file JSON esportato in precedenza
4. La pagina si ricarica automaticamente

Puoi usare Google Drive, Dropbox o email per trasferire il file tra dispositivi.

## Reset tornei

Dalla pagina **Admin**, sezione **"Azzera Tornei Singoli"**:
- Ogni torneo mostra il numero di partite gia giocate.
- Il pulsante **Azzera** resetta tutti i risultati del singolo torneo con richiesta di conferma.
- Il pulsante **Reset Tornei** in cima azzera tutti gli 8 tornei contemporaneamente.

## Modello dati

### Tournament
```typescript
interface Tournament {
    id: string;
    name: string;
    participants: string[];
    matches: Match[];
    energia: string;       // tipo energia Pokemon
    badgeImage?: string;   // percorso immagine medaglia
    gym?: string;
    leader?: string;
}
```

### Match
```typescript
interface Match {
    id: string;
    participant1: string;
    participant2: string;
    winner?: string;
}
```

## Licenza
MIT
