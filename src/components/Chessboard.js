// src/components/Chessboard.js
import React, { useState, useEffect } from "react";
import "./Chessboard.css";

const Chessboard = ({
  gameMode,
  game,
  makeMove,
  lastMove,
  isFlipped,
  gameOver,
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [hoveredSquare, setHoveredSquare] = useState(null);

  const isGameActive = gameMode === "local" && !gameOver;

  // Reset local state when game resets
  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
    setHoveredSquare(null);
  }, [game, gameOver]);

  const handleSquareClick = (row, col) => {
    if (!isGameActive) return;

    const square = indexToSquare(row, col);

    if (selectedSquare) {
      const validMove = possibleMoves.some((move) => move.to === square);

      if (validMove) {
        const move = {
          from: selectedSquare,
          to: square,
          promotion: "q",
        };

        const result = makeMove(move);

        if (result) {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      } else {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square: square, verbose: true });
          setPossibleMoves(moves);
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square: square, verbose: true });
        setPossibleMoves(moves);
      }
    }
  };

  const handleDragStart = (event, row, col) => {
    if (!isGameActive) return;

    const square = indexToSquare(row, col);
    const piece = game.get(square);

    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square, verbose: true });
      setPossibleMoves(moves);

      event.dataTransfer.setData("fromSquare", square);
    }
  };

  const handleDrop = (event, row, col) => {
    if (!isGameActive) return;

    event.preventDefault();
    const fromSquare = event.dataTransfer.getData("fromSquare");
    const toSquare = indexToSquare(row, col);

    if (fromSquare) {
      const validMove = possibleMoves.some((move) => move.to === toSquare);

      if (validMove) {
        const move = {
          from: fromSquare,
          to: toSquare,
          promotion: "q",
        };

        const result = makeMove(move);

        if (result) {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    }
    setHoveredSquare(null);
  };

  const handleDragOver = (event) => {
    if (!isGameActive) return;
    event.preventDefault();
  };

  const handleDragEnter = (event, row, col) => {
    if (!isGameActive) return;
    const square = indexToSquare(row, col);
    setHoveredSquare(square);
  };

  const handleDragLeave = () => {
    if (!isGameActive) return;
    setHoveredSquare(null);
  };

  const indexToSquare = (row, col) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const file = files[col];
    const rank = 8 - row;
    return file + rank;
  };

  const getPieceImage = (piece) => {
    const colorPrefix = piece.color === "w" ? "w" : "b";
    const typeMap = {
      k: "K",
      q: "Q",
      r: "R",
      b: "B",
      n: "N",
      p: "P",
    };
    return `${colorPrefix}${typeMap[piece.type]}.png`;
  };

  const renderBoard = () => {
    const board = game.board();
    const rows = [];

    // Define row and column indices based on isFlipped
    const rowIndices = isFlipped
      ? [...Array(8).keys()].reverse()
      : [...Array(8).keys()];
    const colIndices = isFlipped
      ? [...Array(8).keys()].reverse()
      : [...Array(8).keys()];

    for (let rowIndex of rowIndices) {
      const squares = [];
      for (let colIndex of colIndices) {
        const piece = board[rowIndex][colIndex];
        const squareNotation = indexToSquare(rowIndex, colIndex);

        const isBlack = (rowIndex + colIndex) % 2 === 1;
        const isSelected = selectedSquare === squareNotation;
        const isHovered = hoveredSquare === squareNotation;

        const isPossibleMove = possibleMoves.some(
          (move) => move.to === squareNotation
        );

        const isCapture =
          isPossibleMove &&
          possibleMoves.some(
            (move) => move.to === squareNotation && move.flags.includes("c")
          );

        const isLastMove =
          lastMove &&
          (lastMove.from === squareNotation || lastMove.to === squareNotation);

        squares.push(
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`square ${isBlack ? "black" : "white"} ${
              isSelected ? "selected" : ""
            } ${isHovered ? "highlight" : ""} ${isLastMove ? "last-move" : ""}`}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            onDragOver={handleDragOver}
            onDragEnter={(event) => handleDragEnter(event, rowIndex, colIndex)}
            onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
            onDragLeave={handleDragLeave}
          >
            {piece && (
              <img
                src={`${process.env.PUBLIC_URL}/assets/pieces/${getPieceImage(
                  piece
                )}`}
                alt={`${piece.color} ${piece.type}`}
                className="piece"
                draggable
                onDragStart={(event) =>
                  handleDragStart(event, rowIndex, colIndex)
                }
              />
            )}
            {isPossibleMove && !isCapture && (
              <div className="possible-move"></div>
            )}
            {isPossibleMove && isCapture && (
              <div className="possible-capture"></div>
            )}
          </div>
        );
      }
      rows.push(
        <div key={rowIndex} className="row">
          {squares}
        </div>
      );
    }

    return rows;
  };

  return <div className="chessboard">{renderBoard()}</div>;
};

export default Chessboard;
