interface SplashPageProps {
    onPlay: () => void;
}

function SplashPage({ onPlay }: SplashPageProps) {
    const floatingNumbers: number[] = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

    return (
        <div className="splash-container">
            <h1 className="game-title">2 0 4 8</h1>

            <div className="floating-numbers">
                {floatingNumbers.slice(0, 8).map((num, i) => (
                    <div
                        key={i}
                        className="number-bubble"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {num}
                    </div>
                ))}
            </div>

            <button className="play-button" onClick={onPlay}>
                PLAY NOW
            </button>

            <p className="guest-text">✨ Just play and have fun! ✨</p>
        </div>
    );
}

export default SplashPage;