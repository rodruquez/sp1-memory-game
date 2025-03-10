
import React, { useState, useEffect } from 'react';

const generateCards = () => {
  const symbols = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍓'];
  const pairedSymbols = [...symbols, ...symbols];
  return pairedSymbols
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({ id: index, symbol, flipped: false, matched: false }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].symbol === cards[second].symbol) {
        const updatedCards = cards.map((card, idx) =>
          idx === first || idx === second ? { ...card, matched: true } : card
        );
        setCards(updatedCards);
        setScore(score + 10);
        setFlippedCards([]);
        if (updatedCards.every((card) => card.matched)) {
          setCompleted(true);
        }
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((card, idx) =>
            idx === first || idx === second ? { ...card, flipped: false } : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, score]);

  const flipCard = (index) => {
    if (flippedCards.length < 2 && !cards[index].flipped && !cards[index].matched) {
      const updatedCards = cards.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      );
      setCards(updatedCards);
      setFlippedCards([...flippedCards, index]);
    }
  };

  const restartGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Memory Game with SP1 Logic</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-16 h-16 flex items-center justify-center text-2xl cursor-pointer ${
              card.flipped || card.matched ? 'bg-green-200' : 'bg-gray-300'
            }`}
            onClick={() => flipCard(card.id)}
          >
            {card.flipped || card.matched ? card.symbol : '❓'}
          </div>
        ))}
      </div>
      <p className="text-xl">Score: {score}</p>
      {completed && <p className="text-2xl font-semibold text-green-500">You Won!</p>}
      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
}
