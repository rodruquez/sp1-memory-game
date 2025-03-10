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

const initialSetup = (deck) => {
  const tableau = [];
  let index = 0;
  for (let i = 0; i < 7; i++) {
    const column = [];
    for (let j = 0; j <= i; j++) {
      column.push({ ...deck[index], flipped: j === i });
      index++;
    }
    tableau.push(column);
  }
  return { tableau, stock: deck.slice(index) };
};

export default function Solitaire() {
  const [deck, setDeck] = useState(generateDeck());
  const [{ tableau, stock }, setGame] = useState(() => initialSetup(deck));

  const flipCard = (colIndex, cardIndex) => {
    const newTableau = tableau.map((col, idx) =>
      idx === colIndex
        ? col.map((card, cIdx) =>
            cIdx === cardIndex ? { ...card, flipped: !card.flipped } : card
          )
        : col
    );
    setGame({ tableau: newTableau, stock });
  };

  const drawFromStock = () => {
    if (stock.length === 0) return;
    const [drawnCard, ...remainingStock] = stock;
    setGame({
      tableau: [...tableau, [{ ...drawnCard, flipped: true }]],
      stock: remainingStock,
    });
  };

  return (
    <div className="w-full h-screen bg-green-800 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-yellow-300 mb-6 pixelated">Pixel Solitaire</h1>
      <button onClick={drawFromStock} className="mb-4 bg-blue-500 text-white p-2 rounded">Draw Card</button>
      <div className="grid grid-cols-7 gap-4 w-11/12 max-w-6xl">
        {tableau.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {col.map((card, cardIndex) => (
              <div
                key={card.id}
                className={`w-20 h-28 border-2 border-gray-500 rounded-md flex items-center justify-center text-2xl bg-gray-900 text-white pixelated cursor-pointer hover:bg-gray-700 transition ${
                  card.flipped ? "bg-yellow-500 text-black" : ""
                }`}
                onClick={() => flipCard(colIndex, cardIndex)}
              >
                {card.flipped ? `${card.value}${card.suit}` : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}