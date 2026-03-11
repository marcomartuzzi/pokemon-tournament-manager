import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component per gestire errori React
 * Segue best practices React per error handling
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Invia a servizio di error reporting (es. Sentry)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div 
            role="alert" 
            style={{ 
              padding: '40px', 
              textAlign: 'center',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              margin: '20px'
            }}
          >
            <h2>⚠️ Si è verificato un errore</h2>
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Dettagli errore
              </summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {this.state.error?.message}
              </pre>
            </details>
            <button 
              onClick={this.handleReset}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Riprova
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
