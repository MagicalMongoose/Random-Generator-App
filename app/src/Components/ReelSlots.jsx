import { useState, useRef } from 'react';
// You'll need to add a slot machine sound to your Assets folder
import slotSound from "../Assets/Slot.mp3";

const ReelSlots = () => {
    // Available symbols for the slot machine
    const symbols = ['🍒', '🍋', '🍇', '💎', '7️⃣', '⭐', '🍀'];
    const SYMBOL_HEIGHT = 80;

    // States
    const [isSpinning, setIsSpinning] = useState(false);
    const [reels, setReels] = useState([
        { symbols: [...symbols], position: 0, targetPosition: 0 },
        { symbols: [...symbols], position: 0, targetPosition: 0 },
        { symbols: [...symbols], position: 0, targetPosition: 0 }
    ]);

    // Audio
    const slotAudio = useRef(new Audio(slotSound));

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        slotAudio.current.currentTime = 0;
        slotAudio.current.play();

        const newReels = reels.map(reel => ({
            ...reel,
            symbols: shuffleArray([...symbols])
        }));
        setReels(newReels);

        // Update final positions when spinning stops
        const stopTimes = [2900, 3300, 3900];
        setTimeout(() => {
            setIsSpinning(false);
            slotAudio.current.pause();
            slotAudio.current.currentTime = 0;
        }, stopTimes[2]);
    };

    const Reel = ({ reel, index, spinning }) => {
        const displaySymbols = [...reel.symbols, ...reel.symbols, ...reel.symbols];

        return (
            <div className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="relative h-full">
                    <div
                        className={`absolute left-0 right-0 ${spinning ? 'spinning' : ''}`}
                        style={{
                            animationDuration: `${3 + index * 0.25}s`
                        }}
                    >
                        {displaySymbols.map((symbol, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center"
                                style={{
                                    height: `${SYMBOL_HEIGHT}px`,
                                    fontSize: '2.25rem'
                                }}
                            >
                                {symbol}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 xl:p-4 xl:space-y-4">
            <div className="p-6">
                <div className="flex gap-2 mb-4">
                    {reels.map((reel, index) => (
                        <Reel
                            key={index}
                            reel={reel}
                            index={index}
                            spinning={isSpinning}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
                >
                    {isSpinning ? "Reeling..." : "Pull Lever"}
                </button>
            </div>

            <div className="h-8 text-center">
                {!isSpinning && reels.every((reel, _, arr) => {
                    const currentSymbolIndex = Math.floor(reel.position / SYMBOL_HEIGHT) % symbols.length;
                    const firstSymbolIndex = Math.floor(arr[0].position / SYMBOL_HEIGHT) % symbols.length;
                    return reel.symbols[currentSymbolIndex] === arr[0].symbols[firstSymbolIndex];
                }) && (
                        <div className="font-semibold text-yellow-500">
                            🎉 JACKPOT! 🎉
                        </div>
                    )}
            </div>

            <style jsx>{`
                    .spinning {
                        animation-name: spinReel;
                        animation-timing-function: cubic-bezier(0.3, 0.8, 0.5, 1);
                        animation-fill-mode: forwards;
                    }

                    @keyframes spinReel {
                        0% { transform: translateY(0); }
                        to { transform: translateY(${-SYMBOL_HEIGHT * symbols.length * 2}px); }
                    }
                `}
            </style>
        </div>
    );
};

export default ReelSlots;