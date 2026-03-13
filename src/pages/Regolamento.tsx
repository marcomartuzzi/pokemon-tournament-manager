import React, { useState, useEffect } from 'react';

const Regolamento: React.FC = () => {
    const pdfUrl = window.location.origin + import.meta.env.BASE_URL + 'Regole%20torneo.pdf';
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

    // Rileva Android: su Android l'iframe PDF nativo non funziona
    const [isAndroid, setIsAndroid] = useState(false);
    useEffect(() => {
        setIsAndroid(/android/i.test(navigator.userAgent));
    }, []);

    return (
        <div style={{ padding: '0 20px 20px', overflowX: 'hidden' }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '16px',
                alignItems: 'center'
            }}>
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        padding: '9px 18px',
                        backgroundColor: '#1565C0',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    📄 Apri PDF
                </a>
                <a
                    href={pdfUrl}
                    download="Regole torneo.pdf"
                    style={{
                        padding: '9px 18px',
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    ⬇️ Scarica PDF
                </a>
            </div>

            {isAndroid ? (
                // Su Android usa Google Docs Viewer
                <iframe
                    src={viewerUrl}
                    title="Regolamento"
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 200px)',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                        minHeight: '400px',
                        boxSizing: 'border-box',
                        display: 'block',
                    }}
                    allow="autoplay"
                />
            ) : (
                // Su iOS/Desktop usa l'embed nativo
                <iframe
                    src={pdfUrl}
                    title="Regolamento"
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 200px)',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                        minHeight: '400px',
                        boxSizing: 'border-box',
                        display: 'block',
                    }}
                />
            )}

            <p style={{ marginTop: '10px', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
                Problemi con la visualizzazione? Usa il pulsante "Apri PDF" qui sopra.
            </p>
        </div>
    );
};

export default Regolamento;
