import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Select } from 'antd';
import Home from "./components/Home";
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import WalletView from './components/WalletView';
import "./App.css";



function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    
      <div className="App">
        <header>
        
          <Select
            value={selectedChain}
            onChange={(val) => setSelectedChain(val)}
            options={[
              { label: "Ethereum", value: "0x1" },
              { label: "Mumbai Testnet", value: "0x13881" },
              { label: "Polygon", value: "0x89" },
              { label: "Avalanche", value: "0xa86a" },
            ]}
            className="dropdown"
          />
        </header>

        <Routes>
          {wallet && seedPhrase ? (
            <Route path="/yourwallet" element={
              <WalletView
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />
            } />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/recover" element={
                <RecoverAccount setSeedPhrase={setSeedPhrase} setWallet={setWallet} />
              } />
              <Route path="/yourwallet" element={
                <CreateAccount setSeedPhrase={setSeedPhrase} setWallet={setWallet} />
              } />
            </>
          )}
        </Routes>
      </div>
  
  );
}

export default App;
