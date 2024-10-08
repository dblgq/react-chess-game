import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  gameMode,
  setGameMode,
  game,
  resetGame,
  handleMoveBack,
  handleFlipBoard,
  handleHome,
}) => {
  const handlePlayFriend = () => {
    resetGame();
    setGameMode("local");
  };

  const handlePlayOnline = () => {
    resetGame();
    setGameMode("online");
    // Placeholder for backend integration
    console.log("Starting online game...");
  };

  const handlePlayBots = () => {
    resetGame();
    setGameMode("bot");
    // Placeholder for bot setup
    console.log("Starting bot game...");
  };

  if (!gameMode) {
    return (
      <div className="sidebar">
        <h1>Dblg`s Chess</h1>
        <div className="button-container">
          <button className="sidebar-button" onClick={handlePlayOnline}>
            Play Online
          </button>
          <button className="sidebar-button" onClick={handlePlayBots}>
            Play Bots
          </button>
          <button className="sidebar-button" onClick={handlePlayFriend}>
            Play a Friend
          </button>
        </div>
      </div>
    );
  } else if (gameMode === "local") {
    const history = game.history();
    const turn = game.turn() === "w" ? "White" : "Black";

    const moveHistory = history.reduce((rows, move, index) => {
      if (index % 2 === 0) {
        rows.push([Math.floor(index / 2) + 1, move]);
      } else {
        rows[rows.length - 1].push(move);
      }
      return rows;
    }, []);

    return (
      <div className="sidebar">
        <h1>Dblg`s Chess</h1>
        <div className="button-container">
          <button className="sidebar-button" onClick={handleHome}>
            Home
          </button>
          <div className="row-buttons">
            <button className="sidebar-button" onClick={handleMoveBack}>
              Move Back
            </button>
            <button className="sidebar-button" onClick={handleFlipBoard}>
              Flip Board
            </button>
          </div>
        </div>
        <div className="game-info">
          <div className="game-info-text">
            <p>Turn: {turn}</p>
            <h2>Move History</h2>
            <div className="table-cont">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>White</th>
                    <th>Black</th>
                  </tr>
                </thead>
                <tbody>
                  {moveHistory
                    .slice()
                    .reverse()
                    .map(([moveNumber, whiteMove, blackMove], index) => (
                      <tr key={moveNumber}>
                        <td>{moveNumber}</td>
                        <td>{whiteMove}</td>
                        <td>{blackMove || ""}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (gameMode === "online") {
    return (
      <div className="sidebar">
        <h1>Dblg`s Chess</h1>
        <button className="sidebar-button" onClick={handleHome}>
          Home
        </button>
        <div className="game-info">
          <div className="game-info-text">
            <p>Online game is not implemented yet.</p>
            {/* Placeholder for online game UI */}
          </div>
        </div>
      </div>
    );
  } else if (gameMode === "bot") {
    return (
      <div className="sidebar">
        <h1>Dblg`s Chess</h1>
        <button className="sidebar-button" onClick={handleHome}>
          Home
        </button>
        <div className="game-info">
          <div className="game-info-text">
            <p>Bot game is not implemented yet.</p>
            {/* Placeholder for online game UI */}
          </div>
        </div>
      </div>
    );
  }
};

export default Sidebar;
