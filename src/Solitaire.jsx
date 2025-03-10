import React, { useState } from "react";

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
  return { tableau, stock: deck.slice(index), foundation: { "♠": [], "♥": [], "♦": [], "♣": [] }, moves: 0, score: 0 };
};

export default function Solitaire() {
  const [deck, setDeck] = useState(generateDeck());
  const [{ tableau, stock, foundation, moves, score }, setGame] = useState(() => initialSetup(deck));

  const moveCard = (fromCol, cardIndex, toCol) => {
    const card = tableau[fromCol][cardIndex];
    const targetColumn = tableau[toCol];
    const targetCard = targetColumn[targetColumn.length - 1];

    if (!targetCard || (card.color !== targetCard.color && values.indexOf(card.value) === values.indexOf(targetCard.value) - 1)) {
      const newTableau = [...tableau];
      const movingCards = newTableau[fromCol].splice(cardIndex);
      newTableau[toCol] = [...newTableau[toCol], ...movingCards];

      if (newTableau[fromCol].length && !newTableau[fromCol][newTableau[fromCol].length - 1].flipped) {
        newTableau[fromCol][newTableau[fromCol].length - 1].flipped = true;
      }

      setGame({ tableau: newTableau, stock, foundation, moves: moves + 1, score: score + 5 });
    }
  };

  const drawFromStock = () => {
    if (stock.length === 0) return;
    const [drawnCard, ...remainingStock] = stock;
    drawnCard.flipped = true;
    setGame({ tableau: [...tableau, [drawnCard]], stock: remainingStock, foundation, moves: moves + 1, score });
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
        <button onClick={drawFromStock} className="bg-pink-500 text-white p-1 rounded">Draw Card</button>
        <button onClick={resetGame} className="bg-pink-700 text-white p-1 rounded">New Game</button>
      </div>
      <div className="grid grid-cols-7 gap-2 w-10/12 max-w-5xl">
        {tableau.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-1">
            {col.map((card, cardIndex) => (
              <div
                key={card.id}
                className={`w-16 h-24 border-2 border-white rounded-md flex items-center justify-center text-lg bg-black text-white pixelated cursor-pointer hover:bg-pink-700 transition ${
                  card.flipped ? "bg-pink-500 text-black" : ""
                }`}
                onClick={() => moveCard(colIndex, cardIndex, colIndex === 6 ? 0 : colIndex + 1)}
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
