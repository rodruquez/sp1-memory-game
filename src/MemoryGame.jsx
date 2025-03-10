import React, { useState } from "react";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const generateDeck = () => {
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value, id: `${suit}-${value}`, flipped: false });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export default function Solitaire() {
  const [deck, setDeck] = useState(generateDeck());

  const flipCard = (index) => {
    const newDeck = deck.map((card, i) =>
      i === index ? { ...card, flipped: !card.flipped } : card
    );
    setDeck(newDeck);
  };

  return (
    <div className="w-full h-screen bg-green-800 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-yellow-300 mb-6 pixelated">Pixel Solitaire</h1>
      <div className="grid grid-cols-7 gap-4 w-11/12 max-w-6xl">
        {deck.map((card, index) => (
          <div
            key={card.id}
            className={`w-20 h-28 border-2 border-gray-500 rounded-md flex items-center justify-center text-2xl bg-gray-900 text-white pixelated cursor-pointer hover:bg-gray-700 transition ${
              card.flipped ? "bg-yellow-500 text-black" : ""
            }`}
            onClick={() => flipCard(index)}
          >
            {card.flipped ? `${card.value}${card.suit}` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
