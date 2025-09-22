import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const ROWS = 15;
const COLS = 20;
const ANIMATION_SPEED_MS = 60;
const WAVE_WIDTH = 4; // How many cells the glow extends on each side

const HUE_START = 120; // Green
const HUE_END = 320;   // Pink
const HUE_CHANGE_PER_FRAME = 0.5;

const ScannerGrid = () => {
  const [position, setPosition] = useState(WAVE_WIDTH);
  const [direction, setDirection] = useState(1);
  
  const [hue, setHue] = useState(HUE_START);
  const [hueDirection, setHueDirection] = useState(1);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPosition(prevPosition => {
        
        if (prevPosition >= COLS - WAVE_WIDTH && direction === 1) {
          setDirection(-1);
          return prevPosition - 1;
        }
        
        if (prevPosition < WAVE_WIDTH && direction === -1) {
          setDirection(1);
          return prevPosition + 1;
        }
        
        return prevPosition + direction;
      });

      setHue(prevHue => {
        const nextHue = prevHue + HUE_CHANGE_PER_FRAME * hueDirection;

        if (nextHue >= HUE_END) {
          setHueDirection(-1);
        }
        
        if (nextHue <= HUE_START) {
          setHueDirection(1);
        }
        
        return nextHue;
      });
    }, ANIMATION_SPEED_MS);

    return () => clearInterval(animationInterval);
  }, [direction, hueDirection]); // Rerun effect if directions change

  const getCellBackgroundColor = useCallback((col) => {
    const distance = Math.abs(col - position);

    if (distance < WAVE_WIDTH) {
      const intensity = 1 - (distance / WAVE_WIDTH);
      const lightness = 50 * intensity; // Use a base lightness of 50 for HSL

      return `hsl(${hue}, 100%, ${lightness}%)`;
    }
    
    return '#1a1a1a'; 
  }, [position, hue]);

  const cells = Array.from({ length: ROWS * COLS }).map((_, index) => {
    const col = index % COLS;
    const style = {
      backgroundColor: getCellBackgroundColor(col),
    };
    return <div key={index} className="grid-cell" style={style} />;
  });

  return (
    <div
      className="grid-container"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      }}
    >
      {cells}
    </div>
  );
};

export default ScannerGrid;
