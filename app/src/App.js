import React, { useState, useEffect, useRef } from 'react';
import Head from "./Assets/Head.svg"
import Tail from "./Assets/Tail.svg"
import coinToss from "./Assets/Coin Toss.mp3"
import diceThrow from "./Assets/Dice Throw.mp3"
import cardDraw from "./Assets/Card Draw.mp3"
import spinningSound from "./Assets/Spinning.mp3";

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

const PlayingCard = ({ value, suit }) => {
	// Previous PlayingCard implementation remains the same
	const suitSymbols = {
		'Hearts': '♥',
		'Diamonds': '♦',
		'Clubs': '♣',
		'Spades': '♠'
	};

	const suitColors = {
		'Hearts': 'text-red-600',
		'Diamonds': 'text-red-600',
		'Clubs': 'text-black',
		'Spades': 'text-black'
	};

	return (
		<div className="w-full h-full bg-white rounded-lg border-2 border-gray-300 flex flex-col justify-between p-2">
			<div className={`text-lg font-bold ${suitColors[suit]}`}>
				{value}
				<span className="ml-1">{suitSymbols[suit]}</span>
			</div>
			<div className={`text-4xl self-center ${suitColors[suit]}`}>
				{suitSymbols[suit]}
			</div>
			<div className={`text-lg font-bold rotate-180 ${suitColors[suit]}`}>
				{value}
				<span className="ml-1">{suitSymbols[suit]}</span>
			</div>
		</div>
	);
};

const SpinningWheel = () => {
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [wheelItems, setWheelItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
	const [inputText, setInputText] = useState('Item 1\nItem 2\nItem 3\nItem 4');
	const [selectedItem, setSelectedItem] = useState(null);
	const [pointerColor, setPointerColor] = useState('rgb(239, 68, 68)');

	// Audio ref
	const spinAudio = useRef(new Audio(spinningSound));

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
		<div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 2xl:p-4 2xl:space-y-4">
			<textarea
				value={inputText}
				onChange={handleInputChange}
				className="w-64 h-32 p-2 border rounded resize-none max-w-fit"
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

const generateColors = (count) => {
	return Array(count).fill(0).map((_, i) =>
		`hsl(${(i * 360) / count}, 70%, 60%)`
	);
};

function App() {
	const [coinResult, setCoinResult] = useState(null);
	const [diceCount, setDiceCount] = useState(2);
	const [dieResults, setDieResults] = useState([1, 1]);
	const [cardResult, setCardResult] = useState(null);
	const [isFlipping, setIsFlipping] = useState(false);
	const [isRolling, setIsRolling] = useState(false);
	const [flipRotation, setFlipRotation] = useState(0);
	const [flipDuration, setFlipDuration] = useState(1);

	// Audio refs
	const coinAudio = useRef(new Audio(coinToss));
	const diceAudio = useRef(new Audio(diceThrow));
	const cardAudio = useRef(new Audio(cardDraw));

	const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
	const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	const [deck, setDeck] = useState(
		suits.flatMap(suit => values.map(value => ({ value, suit })))
	);

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

	const handleDiceCountChange = (e) => {
		const value = e.target.value;
		// Allow empty input while typing
		if (value === '') {
			setDiceCount(1);
			return;
		}

		const newCount = parseInt(value);
		// Only update if it's a valid number between 1-6
		if (!isNaN(newCount) && newCount >= 1 && newCount <= 6) {
			setDiceCount(newCount);
		}
	};

	const handleCardDraw = () => {
		if (deck.length === 0) {
			setCardResult(null);
			setDeck(suits.flatMap(suit => values.map(value => ({ value, suit }))));
			return;
		}

		// Play sound
		cardAudio.current.currentTime = 0;
		cardAudio.current.play();

		const randomIndex = Math.floor(Math.random() * deck.length);
		const newDeck = [...deck];
		const drawnCard = newDeck.splice(randomIndex, 1)[0];

		setDeck(newDeck);
		setCardResult(drawnCard);
	};

	return (
		<div className="bg-gray-200 flex flex-col py-8">
			<div className="flex-1 flex flex-col justify-between p-1 space-y-1 2xl:p-4 2xl:space-y-4">
				{/* Coin Section */}
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

				{/* Die Section */}
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

				{/* Card Section */}
				<div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 2xl:p-4 2xl:space-y-4">
					<div className="relative w-24 h-32">
						{cardResult ? (
							<PlayingCard value={cardResult.value} suit={cardResult.suit} />
						) : (
							<div className="w-full h-full bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center">
								<div className="text-gray-400">?</div>
							</div>
						)}
					</div>
					<button
						onClick={handleCardDraw}
						className="w-full max-w-xs bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					>
						Draw Card
					</button>
					<div className="h-8 text-center space-y-1">
						{cardResult && (
							<div className="font-semibold">
								{cardResult.value} of {cardResult.suit}
							</div>
						)}
						<div className="text-sm text-gray-500">
							Cards remaining: {deck.length}
						</div>
					</div>
				</div>

				{/* Spinny Spinner */}
				<div>
					<SpinningWheel />
				</div>
			</div>

			<style jsx global>{`
			.perspective {
			perspective: 1000px;
			}

			.preserve-3d {
			transform-style: preserve-3d;
			}

			@keyframes roll3D {
			0% { 
				transform: rotateX(0) rotateY(0) rotateZ(0); 
			}
			30% {
				transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) translate3d(10px, -20px, 30px);
			}
			60% {
				transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg) translate3d(-20px, 10px, -30px);
			}
			85% {
				transform: rotateX(1080deg) rotateY(720deg) rotateZ(270deg) translate3d(5px, 5px, 5px);
			}
			100% { 
				transform: rotateX(1080deg) rotateY(720deg) rotateZ(360deg) translate3d(0, 0, 0); 
			}
			}

			/* Hide number input spinners */
			input[type=number]::-webkit-inner-spin-button, 
			input[type=number]::-webkit-outer-spin-button { 
			-webkit-appearance: none;
			margin: 0;
			}
			input[type=number] {
			-moz-appearance: textfield;
			}
		`}</style>
		</div>
	);
}

export default App;