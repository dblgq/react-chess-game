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

  const makeMove = (move) => {
    const gameCopy = new Chess();
    // Get the current move history in verbose mode
    const moves = game.history({ verbose: true });
    // Replay all the moves to reconstruct the game state
    moves.forEach((m) => gameCopy.move(m));
    // Apply the new move
    const result = gameCopy.move(move);
    if (result) {
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
    }
    return result;
  };

  const resetGame = () => {
    setGame(new Chess());
    setLastMove(null); // Reset lastMove
    setIsFlipped(false);
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
    <div className="main-container">
      <div className="chessboard-container">
        <Chessboard
          gameMode={gameMode}
          game={game}
          makeMove={makeMove}
          lastMove={lastMove}
          isFlipped={isFlipped}
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
        />
      </div>
    </div>
  );
}

export default App;
