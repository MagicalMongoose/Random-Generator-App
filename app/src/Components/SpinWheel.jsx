import { useState, useRef } from 'react';
import spinningSound from "../Assets/Spinning.mp3";


const SpinWheel = () => {
    // States
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [wheelItems, setWheelItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    const [inputText, setInputText] = useState('Item 1\nItem 2\nItem 3\nItem 4');
    const [selectedItem, setSelectedItem] = useState(null);
    const [pointerColor, setPointerColor] = useState('rgb(239, 68, 68)');

    // Audio
    const spinAudio = useRef(new Audio(spinningSound));

    // Helper Functions
    const generateColors = (count) => {
        return Array(count).fill(0).map((_, i) =>
            `hsl(${(i * 360) / count}, 70%, 60%)`
        );
    };

    const colors = generateColors(wheelItems.length);

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        const spinDegrees = (5 * 360) + Math.random() * 360;
        const finalRotation = rotation + spinDegrees;

        // Play sound
        spinAudio.current.currentTime = 0;
        spinAudio.current.play();

        setRotation(finalRotation);

        setTimeout(() => {
            const normalizedRotation = finalRotation % 360;
            const sectorSize = 360 / wheelItems.length;
            // Add 180 to account for items being reversed from visual rotation
            let selectedIndex = Math.floor(((360 - (normalizedRotation % 360)) - 90) / sectorSize) % wheelItems.length;
            if (selectedIndex < 0) {
                selectedIndex = wheelItems.length - 1;
            }
            setSelectedItem(wheelItems[selectedIndex]);
            setPointerColor(colors[selectedIndex]);
            setIsSpinning(false);
            spinAudio.current.pause();
            spinAudio.current.currentTime = 0;
        }, 5000);
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        const items = text.split(/[,\n]/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
        setWheelItems(items);
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 xl:p-4 xl:space-y-4">
            <textarea
                value={inputText}
                onChange={handleInputChange}
                className="w-64 h-32 p-2 border rounded resize-none max-w-fit max-h-20"
                placeholder="Enter items (separated by commas or new lines)"
            />

            {/* Container */}
            <div className="relative w-64 h-64">

                {/* Triangle pointer */}
                <div className="absolute left-1/2 -translate-x-1/2 translate-y-4 z-30 rotate-180">
                    <div
                        style={{
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderWidth: '0 8px 12px 8px',
                            borderColor: `transparent transparent ${pointerColor} transparent`,
                        }}
                    />
                </div>

                {/* The Wheel */}
                <svg
                    viewBox="-50 -50 100 100"
                    className="w-full h-full transform"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: `transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)`
                    }}
                >
                    {wheelItems.map((item, i) => {
                        const angle = (360 / wheelItems.length);
                        const startAngle = (i * angle * Math.PI) / 180;
                        const endAngle = ((i + 1) * angle * Math.PI) / 180;
                        const largeArcFlag = angle > 180 ? 1 : 0;

                        // Calculate points for the sector
                        const x1 = 40 * Math.cos(startAngle);
                        const y1 = 40 * Math.sin(startAngle);
                        const x2 = 40 * Math.cos(endAngle);
                        const y2 = 40 * Math.sin(endAngle);

                        // Calculate text position
                        const textAngle = (startAngle + endAngle) / 2;
                        const textRadius = 25; // Slightly inside the sector
                        const textX = textRadius * Math.cos(textAngle);
                        const textY = textRadius * Math.sin(textAngle);

                        return (
                            <g key={i}>
                                <path
                                    d={`M 0 0 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                    fill={colors[i]}
                                    stroke="white"
                                    strokeWidth="0.5"
                                />
                                <text
                                    x={textX}
                                    y={textY}
                                    fontSize="8"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="black"
                                    style={{ fontWeight: 'bold' }}
                                    transform={`rotate(${(i * angle) + (angle / 2)}, ${textX}, ${textY})`}
                                >
                                    {item}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-white rounded-full border-2 border-gray-300 z-10" />

            </div>

            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full max-w-xs bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
            >
                {isSpinning ? 'Spinning...' : 'Spin'}
            </button>

            <div className="h-8 text-center">
                {selectedItem && (
                    <div className="font-semibold">Selected: {selectedItem}</div>
                )}
            </div>
        </div>
    );
};

export default SpinWheel;