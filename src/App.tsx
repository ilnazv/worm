import React from 'react';
import './App.css';
import GameShell from './components/GameShell/GameShell';

const App: React.FC = () => {
  const blockSize = 8;
  const canvasWidth = window.innerWidth - window.innerWidth % blockSize;
  const canvasHeight = window.innerHeight - window.innerHeight % blockSize;
  return (
    <div className="App">
        <GameShell canvasSize={{ width: canvasWidth, height: canvasHeight, blockSize }}></GameShell>
    </div>
  );
}

export default App;
