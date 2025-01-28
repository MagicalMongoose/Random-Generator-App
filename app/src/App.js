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
				0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
				100% { transform: rotateX(720deg) rotateY(720deg) rotateZ(720deg); }
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