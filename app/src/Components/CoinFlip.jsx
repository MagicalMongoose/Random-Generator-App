import { useState, useRef } from 'react';
import Head from "../Assets/Head.svg"
import Tail from "../Assets/Tail.svg"
import coinToss from "../Assets/Coin Toss.mp3"

const CoinFlip = () => {
    const [isFlipping, setIsFlipping] = useState(false);
    const [coinResult, setCoinResult] = useState(null);
    const [flipRotation, setFlipRotation] = useState(0);
    const [flipDuration, setFlipDuration] = useState(1);

    const coinAudio = useRef(new Audio(coinToss));

    const handleCoinFlip = () => {
        setIsFlipping(true);
        const result = Math.random() < 0.5 ? "Head" : "Tail";
        const rotations = Math.floor(Math.random() * 6) + 6; // 6-12 rotations
        const newRotation = rotations * 360 + (result === "Head" ? 0 : 180);
        const newDuration = 1.1 + Math.random() * 0.4; // 1.1-1.5 seconds

        setFlipRotation(newRotation);
        setFlipDuration(newDuration);

        // Play sound
        coinAudio.current.currentTime = 0;
        coinAudio.current.play();

        setTimeout(() => {
            setCoinResult(result);
            setIsFlipping(false);
        }, newDuration * 1000);
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 2xl:p-4 2xl:space-y-4">
					<div className="relative w-32 h-32">
						{/* Coin container with perspective */}
						<div className="relative w-full h-full" style={{ perspective: '1000px' }}>
							{/* Front face (Heads) */}
							<img
								src={Head}
								alt="Heads"
								className="absolute w-full h-full rounded-full backface-hidden"
								style={{
									transform: `rotateY(${flipRotation}deg)`,
									transition: `transform ${flipDuration}s ease-in-out`,
									transformStyle: 'preserve-3d',
									backfaceVisibility: 'hidden'
								}}
							/>
							{/* Back face (Tails) */}
							<img
								src={Tail}
								alt="Tails"
								className="absolute w-full h-full rounded-full backface-hidden"
								style={{
									transform: `rotateY(${flipRotation + 180}deg)`,
									transition: `transform ${flipDuration}s ease-in-out`,
									transformStyle: 'preserve-3d',
									backfaceVisibility: 'hidden'
								}}
							/>
						</div>
					</div>
					<button
						onClick={handleCoinFlip}
						disabled={isFlipping}
						className="w-full max-w-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
					>
						Flip Coin
					</button>
					<div className="h-8 text-center">
						{coinResult && (
							<div className="font-semibold">{coinResult}</div>
						)}
					</div>
				</div>
    );
};

export default CoinFlip;