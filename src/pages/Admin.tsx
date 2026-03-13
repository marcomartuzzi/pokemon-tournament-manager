import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../hooks/useAuth';
import { useTournamentContext } from '../context/TournamentContext';

interface FirestoreUser {
    username: string;
    password: string;
    isAdmin: boolean;
    displayName: string;
}

const emptyForm: Omit<FirestoreUser, 'username'> & { username: string } = {
    username: '',
    password: '',
    isAdmin: false,
    displayName: '',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
};

const Admin: React.FC = () => {
    const { user } = useAuth();
    const { tournaments, resetTournament, resetAllTournaments } = useTournamentContext();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [firestoreUsers, setFirestoreUsers] = useState<FirestoreUser[]>([]);
    const [modal, setModal] = useState<{ mode: 'add' | 'edit'; form: typeof emptyForm } | null>(null);
    const [saving, setSaving] = useState(false);

    const loadUsers = () => {
        getDocs(collection(db, 'users')).then(snapshot => {
            const users = snapshot.docs.map(d => d.data() as FirestoreUser);
            setFirestoreUsers(users.sort((a, b) => a.username.localeCompare(b.username)));
        }).catch(console.error);
    };

    useEffect(() => { loadUsers(); }, []);

    const showMsg = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSaveUser = async () => {
        const { username, password, displayName } = modal!.form;
        if (!username.trim() || !password.trim() || !displayName.trim()) {
            showMsg('error', 'Tutti i campi sono obbligatori.');
            return;
        }
        const key = username.trim().toLowerCase();
        setSaving(true);
        try {
            await setDoc(doc(db, 'users', key), {
                username: key,
                password: password.trim(),
                isAdmin: modal!.form.isAdmin,
                displayName: displayName.trim(),
            });
            showMsg('success', modal!.mode === 'add' ? `Utente "${key}" creato.` : `Utente "${key}" aggiornato.`);
            setModal(null);
            loadUsers();
        } catch {
            showMsg('error', 'Errore durante il salvataggio.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async (username: string) => {
        if (username === user?.username) {
            showMsg('error', 'Non puoi eliminare il tuo stesso account.');
            return;
        }
        const admins = firestoreUsers.filter(u => u.isAdmin);
        if (admins.length === 1 && admins[0].username === username) {
            showMsg('error', 'Non puoi eliminare l\'unico amministratore.');
            return;
        }
        if (!window.confirm(`Eliminare l'utente "${username}"?`)) return;
        try {
            await deleteDoc(doc(db, 'users', username));
            showMsg('success', `Utente "${username}" eliminato.`);
            loadUsers();
        } catch {
            showMsg('error', 'Errore durante l\'eliminazione.');
        }
    };

    if (!user || !user.isAdmin) {
        return <div>Non hai i permessi per accedere a questa pagina.</div>;
    }

    const handleReset = async () => {
        if (window.confirm('⚠️ ATTENZIONE: Questo cancellerà tutti i dati salvati e ripristinerà i tornei iniziali. Sei sicuro?')) {
            try {
                await resetAllTournaments();
                setMessage({ type: 'success', text: 'Dati resettati con successo!' });
                setTimeout(() => setMessage(null), 3000);
            } catch {
                setMessage({ type: 'error', text: 'Errore durante il reset.' });
                setTimeout(() => setMessage(null), 4000);
            }
        }
    };

    return (
        <div>
            <h1>Pannello Admin</h1>
            
            {/* Reset Globale */}
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px', 
                marginBottom: '20px' 
            }}>
                <h3>🔄 Reset Globale</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    Cancella tutti i risultati e ripristina i tornei iniziali.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                        onClick={handleReset}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Reset Tutti i Tornei
                    </button>
                </div>

                {message && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}>
                        {message.text}
                    </div>
                )}
            </div>
            {/* Reset Singoli Tornei */}
            <div style={{
                padding: '20px',
                backgroundColor: '#fce4ec',
                border: '2px solid #e91e63',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3>🗑️ Azzera Tornei Singoli</h3>
                <p style={{ fontSize: '14px', color: '#880e4f', marginBottom: '15px' }}>
                    Azzera tutti i risultati delle partite per un singolo torneo.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tournaments.map((t) => (
                        <div key={t.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'white',
                            border: '1px solid #f48fb1',
                            borderRadius: '6px',
                            padding: '10px 15px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {t.badgeImage && (
                                    <img src={import.meta.env.BASE_URL + t.badgeImage} alt={t.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                )}
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{t.name}</span>
                                <span style={{ fontSize: '12px', color: '#999' }}>
                                    {t.matches.filter(m => m.winner).length}/{t.matches.length} partite giocate
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Azzerare tutti i risultati di "${t.name}"?`)) {
                                        resetTournament(t.id);
                                        setMessage({ type: 'success', text: `Torneo "${t.name}" azzerato.` });
                                        setTimeout(() => setMessage(null), 3000);
                                    }
                                }}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: '#e91e63',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                🗑️ Azzera
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {/* Gestione Utenti */}
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#fff3cd', 
                border: '2px solid #ffc107',
                borderRadius: '8px', 
                marginBottom: '20px' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>👥 Utenti Autorizzati</h3>
                    <button
                        onClick={() => setModal({ mode: 'add', form: { ...emptyForm } })}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}
                    >
                        ＋ Nuovo Utente
                    </button>
                </div>
                
                <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2196F3', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Password</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Ruolo</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Nome Visualizzato</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {firestoreUsers.map((u, index) => (
                            <tr 
                                key={u.username} 
                                style={{ 
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                                }}
                            >
                                <td style={{ padding: '10px' }}>
                                    <code style={{ backgroundColor: '#e3f2fd', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                        {u.username}
                                    </code>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <code style={{ backgroundColor: '#ffebee', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                        {u.password}
                                    </code>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {u.isAdmin ? (
                                        <span style={{ backgroundColor: '#ffd54f', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                                            🔑 Admin
                                        </span>
                                    ) : (
                                        <span style={{ backgroundColor: '#e0e0e0', padding: '4px 12px', borderRadius: '12px', fontSize: '13px' }}>
                                            👤 Partecipante
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <strong>{u.displayName}</strong>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => setModal({ mode: 'edit', form: { ...u } })}
                                            style={{
                                                padding: '5px 12px',
                                                backgroundColor: '#2196F3',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                            }}
                                        >
                                            ✏️ Modifica
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u.username)}
                                            style={{
                                                padding: '5px 12px',
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                            }}
                                        >
                                            🗑️ Elimina
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Aggiungi / Modifica Utente */}
            {modal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        width: '100%',
                        maxWidth: '420px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    }}>
                        <h3 style={{ marginTop: 0 }}>
                            {modal.mode === 'add' ? '➕ Nuovo Utente' : `✏️ Modifica "${modal.form.username}"`}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Username</label>
                                <input
                                    style={{ ...inputStyle, backgroundColor: modal.mode === 'edit' ? '#f5f5f5' : 'white' }}
                                    value={modal.form.username}
                                    readOnly={modal.mode === 'edit'}
                                    onChange={e => setModal(m => m && { ...m, form: { ...m.form, username: e.target.value } })}
                                    placeholder="es. mario"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Password</label>
                                <input
                                    style={inputStyle}
                                    value={modal.form.password}
                                    onChange={e => setModal(m => m && { ...m, form: { ...m.form, password: e.target.value } })}
                                    placeholder="Password"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Nome Visualizzato</label>
                                <input
                                    style={inputStyle}
                                    value={modal.form.displayName}
                                    onChange={e => setModal(m => m && { ...m, form: { ...m.form, displayName: e.target.value } })}
                                    placeholder="es. Mario Rossi"
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="isAdmin"
                                    checked={modal.form.isAdmin}
                                    onChange={e => setModal(m => m && { ...m, form: { ...m.form, isAdmin: e.target.checked } })}
                                />
                                <label htmlFor="isAdmin" style={{ fontSize: '14px', cursor: 'pointer' }}>
                                    🔑 Amministratore
                                </label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setModal(null)}
                                style={{
                                    padding: '9px 20px', backgroundColor: '#9e9e9e',
                                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleSaveUser}
                                disabled={saving}
                                style={{
                                    padding: '9px 20px', backgroundColor: '#4CAF50',
                                    color: 'white', border: 'none', borderRadius: '4px',
                                    cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                                }}
                            >
                                {saving ? 'Salvataggio...' : '💾 Salva'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;