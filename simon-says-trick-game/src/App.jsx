import React, { useState, useEffect } from 'react';

// --- CSS Styles ---
// All styles are now included directly in the component.
const GameStyles = () => (
  <style>{`
    body {
      margin: 0;
      font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #282c34;
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .simon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      background-color: #333;
      padding: 30px;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
      border: 10px solid #222;
      width: 450px;
      height: 450px;
      position: relative;
    }

    .simon-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 20px;
      width: 100%;
      height: 100%;
    }

    .simon-pad {
      cursor: pointer;
      background-color: var(--pad-color);
      transition: opacity 0.1s ease-in-out;
      opacity: 0.6;
    }

    .simon-pad:hover {
      opacity: 0.8;
    }

    .simon-pad.active {
      opacity: 1;
      box-shadow: 0 0 30px 10px var(--pad-color);
    }

    #green { --pad-color: #00a74a; border-top-left-radius: 100%; }
    #red { --pad-color: #9f0f17; border-top-right-radius: 100%; }
    #yellow { --pad-color: #cca707; border-bottom-left-radius: 100%; }
    #blue { --pad-color: #094a8f; border-bottom-right-radius: 100%; }

    .controls {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #282c34;
      width: 45%;
      height: 45%;
      border-radius: 50%;
      border: 10px solid #222;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;
      box-sizing: border-box;
    }

    .status-text {
      font-size: 1.2rem;
      margin: 0 0 15px 0;
      color: #fff;
      font-weight: bold;
    }

    .start-button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 15px 25px;
      text-align: center;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .start-button:hover {
      background-color: #45a049;
    }

    .level-display {
      font-size: 1.5rem;
      color: #eee;
      font-weight: bold;
    }
  `}</style>
);


// --- Game Configuration ---
const COLORS = ['green', 'red', 'yellow', 'blue'];
const FLASH_DURATION_MS = 350;
const TIME_BETWEEN_FLASHES_MS = 250;

function App() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, watching, playing, gameover
  const [activeColor, setActiveColor] = useState(null);

  // --- Game Logic Effects ---

  // Effect to play the sequence when it's the computer's turn
  useEffect(() => {
    if (gameState === 'watching' && sequence.length > 0) {
      let flashIndex = 0;
      const interval = setInterval(() => {
        setActiveColor(sequence[flashIndex]);
        
        setTimeout(() => setActiveColor(null), FLASH_DURATION_MS);
        
        flashIndex++;
        if (flashIndex >= sequence.length) {
          clearInterval(interval);
          setGameState('playing');
        }
      }, FLASH_DURATION_MS + TIME_BETWEEN_FLASHES_MS);
    }
  }, [gameState, sequence]);

  // Effect to check the player's input
  useEffect(() => {
    if (gameState !== 'playing' || playerSequence.length === 0) return;

    // Check if the current move is correct
    const isCorrect = sequence[playerSequence.length - 1] === playerSequence[playerSequence.length - 1];

    if (!isCorrect) {
      setGameState('gameover');
      return;
    }

    // Check if the full sequence has been entered correctly
    if (playerSequence.length === sequence.length) {
      setGameState('watching');
      setPlayerSequence([]);
      // Use a timeout to create a slight pause before the next level starts
      setTimeout(() => {
        setLevel(prevLevel => prevLevel + 1);
      }, 800);
    }
  }, [playerSequence, sequence, gameState]);

  // Effect to add a new color to the sequence for the next level
  useEffect(() => {
    if (level > 0 && gameState === 'watching') {
       const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
       setSequence(prevSequence => [...prevSequence, nextColor]);
    }
  }, [level, gameState]);


  // --- Event Handlers ---

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setGameState('watching');
  };

  const handleColorClick = (color) => {
    if (gameState !== 'playing') return;
    setPlayerSequence(prev => [...prev, color]);
  };

  // --- Render Logic ---
  const getGameStatusText = () => {
    switch (gameState) {
      case 'watching':
        return 'Watch carefully...';
      case 'playing':
        return `Level ${level} - Your Turn!`;
      case 'gameover':
        return `Game Over! You reached level ${level}.`;
      default:
        return 'Press Start to Play!';
    }
  };

  return (
    <>
      <GameStyles />
      <div className="simon-container">
        <div className="simon-grid">
          {COLORS.map((color) => (
            <div
              key={color}
              id={color}
              className={`simon-pad ${activeColor === color ? 'active' : ''}`}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
        <div className="controls">
          <h2 className="status-text">{getGameStatusText()}</h2>
          {gameState === 'idle' || gameState === 'gameover' ? (
            <button className="start-button" onClick={startGame}>
              Start Game
            </button>
          ) : (
            <div className="level-display">Level: {level}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;


