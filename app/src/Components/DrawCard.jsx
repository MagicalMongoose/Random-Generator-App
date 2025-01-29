import { useState, useRef } from 'react';
import cardDraw from "../Assets/Card Draw.mp3"

const DrawCard = () => {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // States
    const [cardResult, setCardResult] = useState(null);
    const [deck, setDeck] = useState(
        suits.flatMap(suit => values.map(value => ({ value, suit })))
    );

    // Audio
    const cardAudio = useRef(new Audio(cardDraw));

    // Helper Functions
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


    const PlayingCard = ({ value, suit }) => {
        // Generate visual representation of each playing card
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

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-1 space-y-1 xl:p-4 xl:space-y-4">
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
    );
}

export default DrawCard;