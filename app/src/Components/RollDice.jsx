import { useState, useEffect, useRef } from 'react';
import diceThrow from "../Assets/Dice Throw.mp3"

const RollDice = () => {
    // States
    const [diceCount, setDiceCount] = useState(2);
    const [diceType, setDiceType] = useState(6);
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
                Math.floor(Math.random() * diceType) + 1
            );
            setDieResults(newResults);
            setIsRolling(false);
        }, 1200);
    };

    const dotPatterns = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [25, 75], [75, 25], [75, 75]],
        5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
        6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]]
    };

    const getDotPattern = (value) => {
        const pattern = dotPatterns[value];
        if (!pattern) return '';
        return pattern.map(([cx, cy]) =>
            `<circle cx="${cx}" cy="${cy}" r="8" fill="black"/>`
        ).join('');
    };

    // 3D Dice Shape Definitions
    const diceShapes = {
        4: {
            path: (value) => `
                <g transform="translate(50, 50)">
                    <path d="
                        M 0 -35
                        L 30 25
                        L -30 25
                        Z
                    " fill="white" stroke="black" strokeWidth="2" />
                    <text x="0" y="10" textAnchor="middle" fontSize="24" fill="black">${value}</text>
                </g>
            `,
            transforms: {
                front: 'rotateY(0deg) rotateX(-25deg)',
                back: 'rotateY(180deg) rotateX(-25deg)',
                right: 'rotateY(120deg) rotateX(-25deg)',
                left: 'rotateY(-120deg) rotateX(-25deg)',
            }
        },
        6: {
            path: (value) => `
                <rect x="10" y="10" width="80" height="80" rx="10" fill="white" stroke="black" strokeWidth="5"/>
                ${getDotPattern(value)}
            `,
            transforms: {
                front: 'translateZ(40px)',
                back: 'translateZ(-40px) rotateY(180deg)',
                right: 'translateX(40px) rotateY(90deg)',
                left: 'translateX(-40px) rotateY(-90deg)',
                top: 'translateY(-40px) rotateX(90deg)',
                bottom: 'translateY(40px) rotateX(-90deg)',
            }
        },
        8: {
            path: (value) => `
                <g transform="translate(50, 50)">
                    <path d="
                        M 0 -35
                        L 35 0
                        L 0 35
                        L -35 0
                        Z
                    " fill="white" stroke="black" strokeWidth="2" />
                    <text x="0" y="8" textAnchor="middle" fontSize="24" fill="black">${value}</text>
                </g>
            `,
            transforms: {
                front: 'rotateX(-30deg)',
                back: 'rotateY(180deg) rotateX(-30deg)',
                right: 'rotateY(90deg) rotateX(-30deg)',
                left: 'rotateY(-90deg) rotateX(-30deg)',
            }
        },
        10: {
            path: (value) => `
                <g transform="translate(50, 50)">
                    <path d="
                        M 0 -30
                        L 30 -10
                        L 20 25
                        L -20 25
                        L -30 -10
                        Z
                    " fill="white" stroke="black" strokeWidth="2" />
                    <text x="0" y="10" textAnchor="middle" fontSize="24" fill="black">${value}</text>
                </g>
            `,
            transforms: {
                front: 'rotateX(-25deg)',
                back: 'rotateY(180deg) rotateX(-25deg)',
                right: 'rotateY(72deg) rotateX(-25deg)',
                left: 'rotateY(-72deg) rotateX(-25deg)',
            }
        },
        12: {
            path: (value) => `
                <g transform="translate(50, 50)">
                    <path d="
                        M 0 -30
                        L 17 -25
                        L 28 -10
                        L 28 10
                        L 17 25
                        L 0 30
                        L -17 25
                        L -28 10
                        L -28 -10
                        L -17 -25
                        Z
                    " fill="white" stroke="black" strokeWidth="2" />
                    <text x="0" y="8" textAnchor="middle" fontSize="24" fill="black">${value}</text>
                </g>
            `,
            transforms: {
                front: 'rotateX(-25deg)',
                back: 'rotateY(180deg) rotateX(-25deg)',
                right: 'rotateY(72deg) rotateX(-25deg)',
                left: 'rotateY(-72deg) rotateX(-25deg)',
            }
        },
        20: {
            path: (value) => `
                <g transform="translate(50, 50)">
                    <path d="
                        M 0 -30
                        L 28 -10
                        L 18 25
                        L -18 25
                        L -28 -10
                        Z
                    " fill="white" stroke="black" strokeWidth="2" />
                    <text x="0" y="8" textAnchor="middle" fontSize="24" fill="black">${value}</text>
                </g>
            `,
            transforms: {
                front: 'rotateX(-25deg)',
                back: 'rotateY(180deg) rotateX(-25deg)',
                right: 'rotateY(72deg) rotateX(-25deg)',
                left: 'rotateY(-72deg) rotateX(-25deg)',
            }
        },
        100: {
            path: (value) => `
                <g transform="translate(50, 50)">
                    <circle r="35" fill="white" stroke="black" strokeWidth="2"/>
                    <text x="0" y="8" textAnchor="middle" fontSize="${value.length > 2 ? '20' : '24'}" fill="black">${value}</text>
                </g>
            `,
            transforms: {
                front: 'rotateX(-25deg)',
                back: 'rotateY(180deg) rotateX(-25deg)',
                right: 'rotateY(90deg) rotateX(-25deg)',
                left: 'rotateY(-90deg) rotateX(-25deg)',
            }
        }
    };

    const DiceFace = ({ value, face = 'front' }) => {
        const shape = diceShapes[diceType];
        if (!shape) return null;

        const transform = shape.transforms[face] || '';

        return (
            <div
                className="absolute w-full h-full"
                style={{ transform }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <g dangerouslySetInnerHTML={{ __html: shape.path(value) }} />
                </svg>
            </div>
        );
    };

    const Die3D = ({ value, isRolling, offset = 0 }) => {
        const faces = {
            front: value,
            back: diceType + 1 - value,
            right: Math.ceil(Math.random() * diceType),
            left: Math.ceil(Math.random() * diceType),
            top: Math.ceil(Math.random() * diceType),
            bottom: Math.ceil(Math.random() * diceType),
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

    // Available dice types
    const diceTypes = [4, 6, 8, 10, 12, 20, 100];

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
            <div className="flex items-center gap-4 w-full max-w-md">
                <div className="flex flex-col gap-1 items-center">
                    <div className="grid grid-cols-4 gap-1">
                        {diceTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setDiceType(type)}
                                disabled={isRolling}
                                className={`w-10 h-8 text-sm font-medium rounded 
                                    ${diceType === type
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-blue-100'
                                    } 
                                    disabled:opacity-50 transition-colors`}
                            >
                                D{type}
                            </button>
                        ))}
                    </div>
                </div>

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