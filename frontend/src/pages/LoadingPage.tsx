import { useState, useEffect } from 'react';

function LoadingPage(): JSX.Element {
    const [countdown, setCountdown] = useState<number>(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 800);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="loading-container">
            <div className="loading-tiles">
                <div className="tile-loader">2</div>
                <div className="tile-loader" style={{ animationDelay: '0.2s' }}>4</div>
                <div className="tile-loader" style={{ animationDelay: '0.4s' }}>8</div>
                <div className="tile-loader" style={{ animationDelay: '0.6s' }}>16</div>
            </div>
            <div className="countdown">
                {countdown > 0 ? countdown : 'GO!'}
            </div>
        </div>
    );
}

export default LoadingPage;