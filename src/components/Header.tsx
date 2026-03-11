import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Header component con navigazione migliorata
 * Stili ottimizzati per leggibilità e accessibilità
 */
const Header: React.FC = () => {
    const { user, logout } = useAuth();

    // Stile base per i link di navigazione
    const navLinkStyle: React.CSSProperties = {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '14px',
        fontFamily: "'Nunito', sans-serif",
        transition: 'all 0.2s ease',
        display: 'inline-block',
        backgroundColor: 'rgba(255,255,255,0.12)',
        letterSpacing: '0.3px',
    };

    return (
        <header style={{ 
            background: 'linear-gradient(135deg, #003A70 0%, #3D7DCA 100%)',
            boxShadow: '0 3px 12px rgba(0,58,112,0.4)',
            padding: '15px 30px',
            marginBottom: '20px',
            borderBottom: '4px solid #FFCB05',
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <h1 style={{ 
                    margin: 0, 
                    color: '#FFCB05',
                    fontSize: '13px',
                    fontFamily: "'Press Start 2P', monospace",
                    letterSpacing: '1px',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <img
                        src={import.meta.env.BASE_URL + 'imgs/tcgpocketlogo_en.png'}
                        alt="Pokémon TCG Pocket"
                        style={{ height: '36px', objectFit: 'contain' }}
                    />
                    Pokémon Tournament Manager
                </h1>
                
                {user && (
                    <div style={{ 
                        fontSize: '14px', 
                        color: 'white',
                        backgroundColor: 'rgba(255,203,5,0.2)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,203,5,0.4)',
                    }}>
                        👤 <strong>{user.displayName || user.username}</strong>
                        {user.isAdmin && <span style={{ color: '#ffd54f' }}> ⭐ (Admin)</span>}
                    </div>
                )}
            </div>
            
            <nav role="navigation" aria-label="Menu principale">
                <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    display: 'flex', 
                    gap: '8px',
                    margin: 0,
                    alignItems: 'center'
                }}>
                    <li>
                        <Link 
                            to="/" 
                            style={{
                                ...navLinkStyle,
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Medagliere
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/regolamento"
                            style={{
                                ...navLinkStyle,
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            📋 Regolamento
                        </Link>
                    </li>
                    {user && (
                        <li>
                            <Link
                                to="/tournaments"
                                style={{
                                    ...navLinkStyle,
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.15)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                🏆 Tornei
                            </Link>
                        </li>
                    )}
                    {user && user.isAdmin && (
                        <li>
                            <Link 
                                to="/admin"
                                style={{
                                    ...navLinkStyle,
                                    color: 'white',
                                    backgroundColor: 'rgba(255,215,0,0.3)',
                                    border: '1px solid rgba(255,215,0,0.5)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,215,0,0.4)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,215,0,0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                ⚙️ Admin
                            </Link>
                        </li>
                    )}
                    <li style={{ marginLeft: 'auto' }}>
                        {user ? (
                            <button 
                                onClick={logout}
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: 'rgba(244,67,54,0.9)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '15px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f44336';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(244,67,54,0.9)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                🚪 Logout
                            </button>
                        ) : (
                            <Link 
                                to="/login"
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    fontWeight: '500',
                                    fontSize: '15px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#45a049';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4CAF50';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                🔑 Login
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;