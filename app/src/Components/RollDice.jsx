import { useState, useEffect, useRef } from 'react';
import diceThrow from "../Assets/Dice Throw.mp3"

const RollDice = () => {
    // States
    const [diceCount, setDiceCount] = useState(2);
    const [dieResults, setDieResults] = useState([1, 1]);
    const [isRolling, setIsRolling] = useState(false);

    // Audio
    const diceAudio = useRef(new Audio(diceThrow));

    // Helper Functions
    useEffect(() => {
		setDieResults(prev => {
			if (prev.length < diceCount) {
				return [...prev, ...Array(diceCount - prev.length).fill(1)];
			}
			return prev.slice(0, diceCount);
		});
	}, [diceCount]);

    const handleDieRoll = () => {
        setIsRolling(true);

        // Play sound
        diceAudio.current.currentTime = 0;
        diceAudio.current.play();

        setTimeout(() => {
            const newResults = Array(diceCount).fill(0).map(() =>
                Math.floor(Math.random() * 6) + 1
            );
            setDieResults(newResults);
            setIsRolling(false);
        }, 1200);
    };

    const DiceFace = ({ value, face = 'front' }) => {
        const patterns = {
            1: [[50, 50]],
            2: [[25, 25], [75, 75]],
            3: [[25, 25], [50, 50], [75, 75]],
            4: [[25, 25], [25, 75], [75, 25], [75, 75]],
            5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
            6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]]
        };

        // Different transforms for each face of the cube
        const faceTransforms = {
            front: 'translateZ(40px)',
            back: 'translateZ(-40px) rotateY(180deg)',
            right: 'translateX(40px) rotateY(90deg)',
            left: 'translateX(-40px) rotateY(-90deg)',
            top: 'translateY(-40px) rotateX(90deg)',
            bottom: 'translateY(40px) rotateX(-90deg)',
        };

        return (
            <div
                className="absolute w-full h-full"
                style={{ transform: faceTransforms[face] }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="5" y="5" width="90" height="90" rx="10" fill="white" stroke="black" strokeWidth="5" />
                    {patterns[value]?.map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="8" fill="black" />
                    ))}
                </svg>
            </div>
        );
    };

    const Die3D = ({ value, isRolling, offset = 0 }) => {
        // Generate random values for opposite faces
        const faces = {
            front: value,
            back: 7 - value, // Opposite face
            right: Math.ceil(Math.random() * 6),
            left: Math.ceil(Math.random() * 6),
            top: Math.ceil(Math.random() * 6),
            bottom: Math.ceil(Math.random() * 6),
        };

        return (
            <div
                className="relative w-full h-full preserve-3d"
                style={{
                    animation: isRolling ? `roll3D ${1.2}s ease-in-out ${offset}s` : 'none',
                    transformStyle: 'preserve-3d'
                }}
            >
                {Object.entries(faces).map(([face, val]) => (
                    <DiceFace key={face} value={val} face={face} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 2xl:p-4 2xl:space-y-4">
            <div className="relative h-32 flex justify-center items-center perspective">
                <div className="flex justify-center gap-2" style={{ width: `${diceCount * 90}px` }}>
                    {Array(diceCount).fill(0).map((_, index) => (
                        <div key={index} className={`${diceCount > 3 ? "w-12 h-12" : "w-16 h-16"} shrink-0`}>
                            <Die3D
                                value={dieResults[index]}
                                isRolling={isRolling}
                                offset={index * 0.1}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4 w-full max-w-xs">
                <button
                    onClick={handleDieRoll}
                    disabled={isRolling}
                    className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    Roll Dice
                </button>
                <div className="flex flex-col gap-1 items-center">
                    <div className="grid grid-cols-3 gap-1">
                        {[1, 2, 3, 4, 5, 6].map((count) => (
                            <button
                                key={count}
                                onClick={() => setDiceCount(count)}
                                disabled={isRolling}
                                className={`w-8 h-8 text-sm font-medium rounded 
								${diceCount === count
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-green-100'
                                    } 
								disabled:opacity-50 transition-colors`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-8 text-center">
                {dieResults && (
                    <div className="font-semibold">
                        Results: {dieResults.join(', ')}
                        {diceCount > 1 && (
                            <span className="text-gray-600">
                                {' '}(Total: {dieResults.reduce((a, b) => a + b, 0)})
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RollDice;