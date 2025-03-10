import React, { useState, useEffect } from "react";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const generateDeck = () => {
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value, id: `${suit}-${value}`, flipped: false, color: suit === "♠" || suit === "♣" ? "black" : "red" });
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
  return {
    tableau,
    stock: deck.slice(index),
    waste: [],
    foundation: { "♠": [], "♥": [], "♦": [], "♣": [] },
    moves: 0,
    score: 0,
    time: 0,
  };
};

export default function Solitaire() {
  const [deck, setDeck] = useState(generateDeck());
  const [{ tableau, stock, waste, foundation, moves, score, time }, setGame] = useState(() => initialSetup(deck));

  useEffect(() => {
    const timer = setInterval(() => setGame((g) => ({ ...g, time: g.time + 1 })), 1000);
    return () => clearInterval(timer);
  }, []);

  const drawFromStock = () => {
    if (stock.length === 0) return;
    const [drawnCard, ...remainingStock] = stock;
    drawnCard.flipped = true;
    setGame((prev) => ({
      ...prev,
      stock: remainingStock,
      waste: [drawnCard, ...prev.waste],
      moves: prev.moves + 1,
    }));
  };

  const moveToFoundation = (card, fromCol, cardIndex) => {
    const foundationPile = foundation[card.suit];
    const validMove =
      (foundationPile.length === 0 && card.value === "A") ||
      (foundationPile.length > 0 && values.indexOf(card.value) === values.indexOf(foundationPile[foundationPile.length - 1].value) + 1);

    if (validMove) {
      const newFoundation = { ...foundation };
      newFoundation[card.suit].push(card);
      const newTableau = tableau.map((col, idx) =>
        idx === fromCol ? col.filter((_, i) => i !== cardIndex) : col
      );

      setGame((prev) => ({
        ...prev,
        foundation: newFoundation,
        tableau: newTableau,
        moves: prev.moves + 1,
        score: prev.score + 10,
      }));
    }
  };

  const moveCard = (fromCol, cardIndex, toCol) => {
    const card = tableau[fromCol][cardIndex];
    const targetPile = tableau[toCol];
    const validMove =
      (!targetPile.length && card.value === "K") ||
      (targetPile.length && card.color !== targetPile[targetPile.length - 1].color && values.indexOf(card.value) === values.indexOf(targetPile[targetPile.length - 1].value) - 1);

    if (validMove) {
      const movingCards = tableau[fromCol].slice(cardIndex);
      const newTableau = tableau.map((col, idx) => {
        if (idx === fromCol) return col.slice(0, cardIndex);
        if (idx === toCol) return [...col, ...movingCards];
        return col;
      });

      setGame((prev) => ({
        ...prev,
        tableau: newTableau,
        moves: prev.moves + 1,
      }));
    }
  };

  const resetGame = () => {
    const newDeck = generateDeck();
    setGame(initialSetup(newDeck));
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-pink-500 mb-4 pixelated">Pixel Solitaire</h1>
      <div className="flex justify-between w-10/12 max-w-5xl mb-4 text-white">
        <span>Score: {score}</span>
        <span>Moves: {moves}</span>
        <span>Time: {Math.floor(time / 60)}:{time % 60}</span>
        <button onClick={drawFromStock} className="bg-pink-500 text-white p-1 rounded">Draw Card</button>
        <button onClick={resetGame} className="bg-pink-700 text-white p-1 rounded">New Game</button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(foundation).map(([suit, cards]) => (
          <div key={suit} className="w-16 h-24 border-2 border-white rounded-md flex items-center justify-center text-lg bg-black text-white">
            {cards.length ? `${cards[cards.length - 1].value}${suit}` : suit}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 w-10/12 max-w-5xl">
        {tableau.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-1">
            {col.map((card, cardIndex) => (
              <div
                key={card.id}
                className={`w-16 h-24 border-2 border-white rounded-md flex items-center justify-center text-lg bg-black text-white pixelated cursor-pointer hover:bg-pink-700 transition ${card.flipped ? "bg-pink-500 text-black" : ""}`}
                onDoubleClick={() => moveToFoundation(card, colIndex, cardIndex)}
                onClick={() => moveCard(colIndex, cardIndex, (colIndex + 1) % 7)}
              >
                {card.flipped ? `${card.value}${card.suit}` : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 w-10/12 max-w-5xl">
        <div className="w-16 h-24 border-2 border-white rounded-md flex items-center justify-center text-lg bg-black text-white">
          {waste.length > 0 ? `${waste[0].value}${waste[0].suit}` : "Waste"}
        </div>
      </div>
    </div>
  );
}
