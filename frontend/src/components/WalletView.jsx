import React, { useEffect, useState } from "react";
import { Divider, Tooltip, List, Avatar, Spin, Tabs, Input, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";

function WalletView({ wallet, setWallet, seedPhrase, setSeedPhrase, selectedChain }) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState("");
  const [sendToAddress, setSendToAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);

  const items = [
    {
      key: "3",
      label: `Tokens`,
      children: tokens.length > 0 ? (
        <List
          bordered
          itemLayout="horizontal"
          dataSource={tokens}
          renderItem={(item) => (
            <List.Item style={{ textAlign: "left" }}>
              <List.Item.Meta avatar={<Avatar src={item.logo} />} title={item.symbol} description={item.name} />
              <div>{(Number(item.balance) / 10 ** Number(item.decimals)).toFixed(2)} Tokens</div>
            </List.Item>
          )}
        />
      ) : (
        <span>You do not have any tokens yet.</span>
      ),
    },
    {
      key: "2",
      label: `NFTs`,
      children: nfts.length > 0 ? (
        nfts.map((e, i) => <img key={i} className="nftImage" alt="nftImage" src={e} />)
      ) : (
        <span>You do not have any NFTs yet.</span>
      ),
    },
    {
      key: "1",
      label: `Transfer`,
      children: (
        <>
          <h3>Native Balance</h3>
          <h1>
            {Number(balance).toFixed(2)} {CHAINS_CONFIG[selectedChain]?.ticker || "ETH"}
          </h1>
          <div className="sendRow">
            <p style={{ width: "90px", textAlign: "left" }}>To:</p>
            <Input value={sendToAddress} onChange={(e) => setSendToAddress(e.target.value)} placeholder="0x..." />
          </div>
          <div className="sendRow">
            <p style={{ width: "90px", textAlign: "left" }}>Amount:</p>
            <Input
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
              placeholder="Native tokens you wish to send..."
            />
          </div>
          <Button
            style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
            type="primary"
            onClick={() => sendTransaction(sendToAddress, amountToSend)}
            disabled={!sendToAddress || !amountToSend || processing}
          >
            {processing ? "Processing..." : "Send Tokens"}
          </Button>
          {processing && (
            <>
              <Spin />
              {hash && (
                <Tooltip title={hash}>
                  <p>Hover For Tx Hash</p>
                </Tooltip>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  async function sendTransaction(to, amount) {
    if (!ethers.utils.isAddress(to)) {
      alert("Invalid Ethereum address.");
      return;
    }

    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);
      await transaction.wait();
      setHash(null);
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");

      getAccountTokens();
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed. Check console for details.");
      setProcessing(false);
    }
  }

  async function getAccountTokens() {
    setFetching(true);
    try {
      const res = await axios.get("http://localhost:3001/getTokens", {
        params: {
          userAddress: wallet,
          chain: selectedChain,
        },
      });

      const response = res.data;
      if (response.tokens) setTokens(response.tokens);
      if (response.nfts) setNfts(response.nfts);
      setBalance(Number(response.balance) || 0);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setTokens([]);
      setNfts([]);
      setBalance(0);
    }
    setFetching(false);
  }

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts([]);
    setTokens([]);
    setBalance(0);
    navigate("/");
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    getAccountTokens();
  }, [wallet, selectedChain]);

  return (
    <div className="content">
      <div className="logoutButton" onClick={logout}>
        <LogoutOutlined />
      </div>
      <div className="walletName">Wallet</div>
      <Tooltip title={wallet}>
        <div>{wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : "No wallet connected"}</div>
      </Tooltip>
      <Divider />
      {fetching ? <Spin /> : <Tabs defaultActiveKey="1" items={items} className="walletView" />}
    </div>
  );
}

export default WalletView;
