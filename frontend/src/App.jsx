import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Select, message, Spin } from 'antd';
import './App.css';
import { ethers } from 'ethers';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import WalletView from './components/WalletView';

// Function to handle Ethereum authentication - keeping your existing logic
const authenticateWallet = async (walletAddress, setWallet, setSeedPhrase) => {
  try {
    // Get the provider (MetaMask)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Request the user to connect their wallet
    await provider.send("eth_requestAccounts", []);
    const address = await signer.getAddress();
    
    if (address.toLowerCase() !== walletAddress.toLowerCase()) {
      message.error('Wallet address does not match.');
      return;
    }

    // Call the backend to get the nonce for the address
    const response = await fetch(`/auth/nonce?walletAddress=${address}`);
    const data = await response.json();
    
    if (data.error) {
      message.error(data.error);
      return;
    }

    // Sign the message for authentication
    const messageToSign = `Sign this message to verify your identity: ${data.nonce}`;
    const signature = await signer.signMessage(messageToSign);

    // Send the signature to the backend to verify
    const verificationResponse = await fetch('/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress: address, signature }),
    });

    const verificationData = await verificationResponse.json();
    if (verificationData.success) {
      setWallet(address);
      setSeedPhrase(data.nonce); // Assuming you use nonce as the seedPhrase here
      message.success('Authentication successful!');
    } else {
      message.error('Authentication failed!');
    }
  } catch (error) {
    message.error('An error occurred during authentication.');
    console.error(error);
  }
};

function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState('0x1');
  const [loading, setLoading] = useState(false);

  // Prompt for wallet authentication on component mount
  useEffect(() => {
    const initWalletAuthentication = async () => {
      setLoading(true);
      if (window.ethereum) {
        // Ask user to connect their wallet
        await authenticateWallet('user-wallet-address', setWallet, setSeedPhrase);
      } else {
        message.error('Ethereum provider (MetaMask) is not installed.');
      }
      setLoading(false);
    };

    initWalletAuthentication();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <h1 className="brand-logo">Cryptex</h1>
            <span className="brand-tagline">Secure Crypto Wallet</span>
          </div>
          
          <div className="network-selector">
            <label>Network:</label>
            <Select
              value={selectedChain}
              onChange={(val) => setSelectedChain(val)}
              options={[
                { label: 'Ethereum', value: '0x1' },
                { label: 'Mumbai Testnet', value: '0x13881' },
                { label: 'Polygon', value: '0x89' },
                { label: 'Avalanche', value: '0xa86a' },
              ]}
              className="network-dropdown"
            />
          </div>
          
          {wallet && (
            <div className="wallet-badge">
              <div className="wallet-icon"></div>
              <span className="wallet-address">
                {`${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="app-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>Connecting to wallet...</p>
          </div>
        ) : (
          <Routes>
            {wallet && seedPhrase ? (
              <Route
                path="/yourwallet"
                element={
                  <WalletView
                    wallet={wallet}
                    setWallet={setWallet}
                    seedPhrase={seedPhrase}
                    setSeedPhrase={setSeedPhrase}
                    selectedChain={selectedChain}
                  />
                }
              />
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/recover" element={<RecoverAccount setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
                <Route path="/yourwallet" element={<CreateAccount setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
              </>
            )}
          </Routes>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Cryptex. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default App;