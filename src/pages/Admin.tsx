import React, { useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { exportToFile, importFromFile } from '../utils/storage';
import { authorizedUsers } from '../data/initialData';
import { useTournamentContext } from '../context/TournamentContext';

const Admin: React.FC = () => {
    const { user } = useAuth();
    const { tournaments, resetTournament } = useTournamentContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!user || !user.isAdmin) {
        return <div>Non hai i permessi per accedere a questa pagina.</div>;
    }

    const handleExport = () => {
        try {
            exportToFile();
            setMessage({ type: 'success', text: 'Dati esportati con successo! Il file è stato scaricato.' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Errore durante l\'esportazione.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await importFromFile(file);
            setMessage({ type: 'success', text: 'Dati importati con successo! Ricarica la pagina per vedere i cambiamenti.' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Errore durante l\'importazione.' });
            setTimeout(() => setMessage(null), 3000);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleReset = () => {
        if (window.confirm('⚠️ ATTENZIONE: Questo cancellerà tutti i dati salvati e ripristinerà i tornei iniziali. Sei sicuro?')) {
            localStorage.removeItem('tournaments');
            setMessage({ type: 'success', text: 'Dati resettati! Ricaricando la pagina...' });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    return (
        <div>
            <h1>Pannello Admin</h1>
            
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px', 
                marginBottom: '20px' 
            }}>
                <h3>💾 Backup & Sincronizzazione</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    <strong>Esporta:</strong> Salva i dati per condividerli tra browser/PC.<br/>
                    <strong>Importa:</strong> Ripristina dati da un file precedentemente esportato.<br/>
                    <strong>Reset:</strong> Cancella tutti i dati salvati e ripristina i tornei iniziali.
                </p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={handleExport}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        📥 Esporta Dati
                    </button>
                    
                    <label 
                        htmlFor="import-file"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'inline-block'
                        }}
                    >
                        📤 Importa Dati
                    </label>
                    <input
                        id="import-file"
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                    
                    <button 
                        onClick={handleReset}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: 'auto'
                        }}
                    >
                        🔄 Reset Tornei
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
                                    <img src={t.badgeImage} alt={t.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
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
                <h3>👥 Utenti Autorizzati</h3>
                <p style={{ fontSize: '14px', color: '#856404', marginBottom: '15px' }}>
                    ⚠️ <strong>Area Riservata Admin:</strong> Elenco completo degli utenti e credenziali di accesso.
                </p>
                
                <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <thead>
                        <tr style={{ 
                            backgroundColor: '#2196F3',
                            color: 'white'
                        }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Password</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Ruolo</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Nome Visualizzato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authorizedUsers.map((user, index) => (
                            <tr 
                                key={user.username} 
                                style={{ 
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                                }}
                            >
                                <td style={{ padding: '10px' }}>
                                    <code style={{ 
                                        backgroundColor: '#e3f2fd',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {user.username}
                                    </code>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <code style={{ 
                                        backgroundColor: '#ffebee',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {user.password}
                                    </code>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {user.isAdmin ? (
                                        <span style={{ 
                                            backgroundColor: '#ffd54f',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: 'bold'
                                        }}>
                                            🔑 Admin
                                        </span>
                                    ) : (
                                        <span style={{ 
                                            backgroundColor: '#e0e0e0',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '13px'
                                        }}>
                                            👤 Partecipante
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <strong>{user.displayName}</strong>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <p style={{ 
                    marginTop: '15px', 
                    fontSize: '12px', 
                    color: '#856404',
                    fontStyle: 'italic',
                    margin: '15px 0 0 0'
                }}>
                    💡 <strong>Nota:</strong> Per aggiungere o modificare utenti, modifica il file <code>src/data/initialData.ts</code>
                </p>
            </div>
        </div>
    );
};

export default Admin;