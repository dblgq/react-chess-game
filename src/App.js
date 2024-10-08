// src/App.js
import React, { useState } from "react";
import Chessboard from "./components/Chessboard";
import Sidebar from "./components/Sidebar";
import { Chess } from "chess.js";
import "./index.css";

function App() {
  const [gameMode, setGameMode] = useState(null); // null, 'local', 'online', 'bot'
  const [game, setGame] = useState(new Chess());
  const [lastMove, setLastMove] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  const makeMove = (move) => {
    const gameCopy = new Chess();
    const moves = game.history({ verbose: true });
    moves.forEach((m) => gameCopy.move(m));
    // Apply the new move
    const resultMove = gameCopy.move(move);
    if (resultMove) {
      setGame(gameCopy);
      setLastMove({ from: move.from, to: move.to }); // Update lastMove

      if (gameMode === "bot" && gameCopy.turn() === "b") {
        // Send move to backend server
        // Placeholder for backend integration
        console.log("Send move to server:", move);
      }

      if (gameMode === "online") {
        // Send move to backend server
        // Placeholder for backend integration
        console.log("Send move to server:", move);
      }

      // Проверка окончания игры
      if (gameCopy.isGameOver()) {
        setGameOver(true);
        if (gameCopy.isCheckmate()) {
          const winner = gameCopy.turn() === "w" ? "Black" : "White"; // turn switches after move
          setResult(`${winner} wins by checkmate!`);
        } else if (gameCopy.isStalemate()) {
          setResult("Draw by stalemate.");
        } else if (gameCopy.isThreefoldRepetition()) {
          setResult("Draw by threefold repetition.");
        } else if (gameCopy.isInsufficientMaterial()) {
          setResult("Draw due to insufficient material.");
        } else if (gameCopy.isFiftyMoves()) {
          setResult("Draw by the fifty-move rule.");
        } else if (gameCopy.isSeventyfiveMoves()) {
          setResult("Draw by the seventy-five-move rule.");
        } else if (gameCopy.isDraw()) {
          setResult("Draw.");
        }
      }
    }
    return resultMove;
  };

  const resetGame = () => {
    setGame(new Chess());
    setLastMove(null); // Reset lastMove
    setIsFlipped(false);
    setGameOver(false); // Сброс gameOver
    setResult(null); // Сброс результата
  };

  const handleMoveBack = () => {
    const gameCopy = new Chess();
    // Get the current move history in verbose mode
    const moves = game.history({ verbose: true });
    // Remove the last move
    moves.pop();
    // Reconstruct the game
    moves.forEach((m) => gameCopy.move(m));
    setGame(gameCopy);

    // Update lastMove
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      setLastMove({ from: lastMove.from, to: lastMove.to });
    } else {
      setLastMove(null);
    }

    // Проверка, не закончилась ли игра после отката хода
    if (gameCopy.isGameOver()) {
      setGameOver(true);
      if (gameCopy.isCheckmate()) {
        const winner = gameCopy.turn() === "w" ? "Black" : "White";
        setResult(`${winner} wins by checkmate!`);
      } else if (gameCopy.isStalemate()) {
        setResult("Draw by stalemate.");
      } else if (gameCopy.isThreefoldRepetition()) {
        setResult("Draw by threefold repetition.");
      } else if (gameCopy.isInsufficientMaterial()) {
        setResult("Draw due to insufficient material.");
      } else if (gameCopy.isFiftyMoves()) {
        setResult("Draw by the fifty-move rule.");
      } else if (gameCopy.isSeventyfiveMoves()) {
        setResult("Draw by the seventy-five-move rule.");
      } else if (gameCopy.isDraw()) {
        setResult("Draw.");
      }
    } else {
      setGameOver(false);
      setResult(null);
    }
  };

  const handleFlipBoard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleHome = () => {
    resetGame();
    setGameMode(null);
    setIsFlipped(false);
  };

  return (
    <div className="main-container" style={{ position: "relative" }}>
      <div className="chessboard-container">
        <Chessboard
          gameMode={gameMode}
          game={game}
          makeMove={makeMove}
          lastMove={lastMove}
          isFlipped={isFlipped}
          gameOver={gameOver}
        />
      </div>
      <div className="sidebar-container">
        <Sidebar
          gameMode={gameMode}
          setGameMode={setGameMode}
          game={game}
          resetGame={resetGame}
          handleMoveBack={handleMoveBack}
          handleFlipBoard={handleFlipBoard}
          handleHome={handleHome}
          gameOver={gameOver}
          result={result}
        />
      </div>
      {/* Добавлено */}
    </div>
  );
}

export default App;
