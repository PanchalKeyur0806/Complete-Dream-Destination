import React from 'react';

const NotFound = () => {
    return (
        <div className="not-found" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ marginBottom: '2rem' }}>The page you are looking for does not exist or has been moved.</p>
            <a href="/" style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: 'bold'
            }}>
                Go Back Home
            </a>
        </div>
    );
};

export default NotFound;