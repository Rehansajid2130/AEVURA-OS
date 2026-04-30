import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { BentoDashboard } from './components/BentoDashboard';
import { Ecosystem } from './components/Ecosystem';
import './index.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Ticker />
      <BentoDashboard />
      <Ecosystem />
    </div>
  );
}

export default App;
