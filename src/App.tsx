import React from 'react';
import './App.css';
import GameShell from './components/GameShell/GameShell';

const App: React.FC = () => {
  return (
    <div className="App">
        <GameShell canvasSize={{ width: 500, height: 800 }}></GameShell>
    </div>
  );
}

export default App;
