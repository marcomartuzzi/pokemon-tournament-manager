import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await login(username, password);
            navigate('/');
        } catch (error: any) {
            setErrorMsg(error.message || 'Login fallito. Controlla le credenziali.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
            <h2>Login al Torneo Pokémon</h2>
            
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                
                {errorMsg && (
                    <div style={{
                        padding: '10px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        {errorMsg}
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Login in corso...' : 'Login'}
                </button>
            </form>
            
            <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196F3',
                borderRadius: '8px'
            }}>
                <p style={{ 
                    margin: 0,
                    fontSize: '14px', 
                    color: '#1976d2'
                }}>
                    ℹ️ <strong>Nota:</strong> Inserisci le tue credenziali per accedere al torneo.
                </p>
            </div>
        </div>
    );
};

export default Login;
