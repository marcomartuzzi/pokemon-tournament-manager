import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ──────────────────────────────────────────────────────────────────────────────
// CONFIGURAZIONE FIREBASE
//
// 1. Vai su https://console.firebase.google.com
// 2. Crea un nuovo progetto (es. "pokemon-tournament")
// 3. Nel progetto: Firestore Database > Crea database > modalità produzione
// 4. Impostazioni progetto (⚙️) > Le tue app > Aggiungi app Web (</>)
// 5. Copia la configurazione e incolla i valori nel file .env.local
//    (copia .env.local.example come punto di partenza)
//
// Regole Firestore consigliate (Firestore > Regole):
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /{document=**} {
//         allow read, write: if true;
//       }
//     }
//   }
// ──────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
