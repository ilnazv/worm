import React from 'react';
import './App.css';
import GameShell from './components/GameShell/GameShell';

const App: React.FC = () => {
  const canvasWidth = window.innerWidth - 10;
  const canvasHeight = window.innerHeight - 10;
  return (
    <div className="App">
        <GameShell canvasSize={{ width: canvasWidth, height: canvasHeight }}></GameShell>
    </div>
  );
}

export default App;
