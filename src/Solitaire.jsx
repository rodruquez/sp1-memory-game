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

  const canMoveToFoundation = (card) => {
    const foundationPile = foundation[card.suit];
    if (foundationPile.length === 0) {
      return card.value === "A";
    }
    const lastCard = foundationPile[foundationPile.length - 1];
    return values.indexOf(card.value) === values.indexOf(lastCard.value) + 1;
  };

  const moveToFoundation = (card, fromCol, cardIndex) => {
    if (canMoveToFoundation(card)) {
      const newFoundation = { ...foundation };
      newFoundation[card.suit].push(card);

      const newTableau = tableau.map((col, idx) =>
        idx === fromCol ? col.filter((_, i) => i !== cardIndex) : col
      );

      if (newTableau[fromCol].length && !newTableau[fromCol][newTableau[fromCol].length - 1].flipped) {
        newTableau[fromCol][newTableau[fromCol].length - 1].flipped = true;
      }

      setGame({ tableau: newTableau, stock, foundation: newFoundation, moves: moves + 1, score: score + 10 });
    }
  };

  const canMoveToTableau = (card, targetCol) => {
    const targetPile = tableau[targetCol];
    if (!targetPile.length) {
      return card.value === "K";
    }
    const lastCard = targetPile[targetPile.length - 1];
    return card.color !== lastCard.color && values.indexOf(card.value) === values.indexOf(lastCard.value) - 1;
  };

  const moveCardToTableau = (fromCol, cardIndex, toCol) => {
    const card = tableau[fromCol][cardIndex];
    if (canMoveToTableau(card, toCol)) {
      const newTableau = tableau.map((col, idx) =>
        idx === fromCol ? col.filter((_, i) => i !== cardIndex) : idx === toCol ? [...col, card] : col
      );

      if (newTableau[fromCol].length && !newTableau[fromCol][newTableau[fromCol].length - 1].flipped) {
        newTableau[fromCol][newTableau[fromCol].length - 1].flipped = true;
      }

      setGame({ tableau: newTableau, stock, foundation, moves: moves + 1, score });
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
                className={`w-16 h-24 border-2 border-white rounded-md flex items-center justify-center text-lg bg-black text-white pixelated cursor-pointer hover:bg-pink-700 transition ${
                  card.flipped ? "bg-pink-500 text-black" : ""
                }`}
                onDoubleClick={() => moveToFoundation(card, colIndex, cardIndex)}
                onClick={() => moveCardToTableau(colIndex, cardIndex, (colIndex + 1) % 7)}
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
