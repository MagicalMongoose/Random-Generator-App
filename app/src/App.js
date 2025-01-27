import React from 'react';
import CoinFlip from './Components/CoinFlip';
import RollDice from './Components/RollDice';
import DrawCard from './Components/DrawCard';
import SpinWheel from './Components/SpinWheel';

function App() {
	return (
		<div className="bg-gray-200 flex flex-col py-8">
			<div className="flex-1 flex flex-col justify-between p-1 space-y-1 2xl:p-4 2xl:space-y-4">
				<CoinFlip />
				<RollDice />
				<DrawCard />
				<SpinWheel />
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