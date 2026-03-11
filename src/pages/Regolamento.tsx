import React from 'react';

const Regolamento: React.FC = () => {
    const pdfUrl = import.meta.env.BASE_URL + 'Regole%20torneo.pdf';

    return (
        <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <a
                    href={pdfUrl}
                    download="Regole torneo.pdf"
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#1565C0',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    ⬇️ Scarica PDF
                </a>
            </div>
            <iframe
                src={pdfUrl}
                title="Regolamento"
                style={{
                    width: '100%',
                    height: 'calc(100vh - 180px)',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5'
                }}
            />
            <p style={{ marginTop: '10px', fontSize: '13px', color: '#888', textAlign: 'center' }}>
                Se il documento non si carica,{' '}
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1565C0' }}>
                    aprilo in una nuova scheda
                </a>.
            </p>
        </div>
    );
};

export default Regolamento;
