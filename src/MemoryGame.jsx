import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const generateCards = () => {
  const symbols = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍓", "🍍", "🥝"];
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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700">
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">Professional Memory Game</h1>
      <div className="grid grid-cols-4 gap-6 w-3/4 max-w-4xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-full aspect-square flex items-center justify-center text-4xl cursor-pointer transition-transform duration-500 ease-in-out transform ${
              card.flipped || card.matched ? "rotate-y-0 bg-green-200" : "rotate-y-180 bg-gray-800"
            } rounded-xl shadow-lg text-white`}
            onClick={() => flipCard(card.id)}
          >
            <CardContent>{card.flipped || card.matched ? card.symbol : "❓"}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-white text-xl">Score: {score}</div>
      {completed && <div className="mt-4 text-2xl font-bold text-yellow-400 animate-bounce">🎉 Congratulations, You Won! 🎉</div>}
      <Button onClick={restartGame} className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-800 text-white rounded-lg shadow-lg transition duration-300">Restart Game</Button>
    </div>
  );
}
