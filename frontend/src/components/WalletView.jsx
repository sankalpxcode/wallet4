import React, { useEffect, useState } from "react";
import { 
  Divider, 
  Tooltip, 
  List, 
  Avatar, 
  Spin, 
  Tabs, 
  Input, 
  Button,
  Card,
  Typography,
  notification,
  Badge,
  Space,
  Empty,
  Tag,
  Statistic,
  Progress
} from 'antd';
import { 
  LogoutOutlined, 
  SendOutlined, 
  WalletOutlined, 
  CopyOutlined, 
  SwapOutlined,
  DollarOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { CHAINS_CONFIG } from '../chains';
import { ethers } from 'ethers';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function WalletView({wallet, setWallet, seedPhrase, setSeedPhrase, selectedChain}) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  
  // Enhanced function to copy wallet address to clipboard with broader browser support
  const copyToClipboard = (text) => {
    try {
      // Try the modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => {
            notification.success({
              message: 'Address Copied',
              description: 'Wallet address copied to clipboard',
              placement: 'topRight',
            });
          })
          .catch(err => {
            // Fall back to the older method if the Clipboard API fails
            fallbackCopyTextToClipboard(text);
          });
      } else {
        // Use fallback for browsers that don't support clipboard API
        fallbackCopyTextToClipboard(text);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      notification.error({
        message: 'Copy Failed',
        description: 'Could not copy the address to clipboard',
        placement: 'topRight',
      });
    }
  };

  // Fallback copy function using document.execCommand
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        notification.success({
          message: 'Address Copied',
          description: 'Wallet address copied to clipboard',
          placement: 'topRight',
        });
      } else {
        notification.warning({
          message: 'Copy Failed',
          description: 'Please try copying the address manually',
          placement: 'topRight',
        });
      }
    } catch (err) {
      notification.error({
        message: 'Copy Failed',
        description: 'Could not copy the address to clipboard',
        placement: 'topRight',
      });
    }
    
    document.body.removeChild(textArea);
  };

  const items = [
    {
      key: "1",
      label: (
        <span>
          <SendOutlined />
          Transfer
        </span>
      ),
      children: (
        <Card className="transfer-card" bordered={false}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Statistic
              title={`Native Balance (${CHAINS_CONFIG[selectedChain].ticker})`}
              value={balance.toFixed(4)}
              precision={4}
              prefix={<DollarOutlined />}
              suffix={CHAINS_CONFIG[selectedChain].ticker}
            />
            
            <Input
              addonBefore="To"
              value={sendToAddress}
              onChange={(e) => setSendToAddress(e.target.value)}
              placeholder="Enter recipient address (0x...)"
              size="large"
              status={sendToAddress && !ethers.isAddress(sendToAddress) ? "error" : ""}
            />
            
            {sendToAddress && !ethers.isAddress(sendToAddress) && (
              <Text type="danger">Please enter a valid Ethereum address</Text>
            )}
            
            <Input
              addonBefore="Amount"
              value={amountToSend}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setAmountToSend(value);
                }
              }}
              placeholder={`Amount in ${CHAINS_CONFIG[selectedChain].ticker}`}
              size="large"
              suffix={CHAINS_CONFIG[selectedChain].ticker}
              status={amountToSend > balance ? "error" : ""}
            />
            
            {amountToSend > balance && (
              <Text type="danger">Insufficient balance</Text>
            )}
            
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              loading={processing}
              block
              style={{ 
                backgroundColor: "#000000", 
                borderColor: "#000000" 
              }}
              disabled={
                !sendToAddress || 
                !amountToSend || 
                amountToSend <= 0 || 
                amountToSend > balance ||
                !ethers.isAddress(sendToAddress)
              }
              onClick={() => sendTransaction(sendToAddress, amountToSend)}
            >
              {processing ? "Processing Transaction..." : "Send Tokens"}
            </Button>

            {processing && hash && (
              <Card size="small" className="transaction-info">
                <Space direction="vertical">
                  <Progress percent={50} status="active" showInfo={false} strokeColor="#000000" />
                  <Text>Transaction in progress...</Text>
                  <Text type="secondary" copyable ellipsis style={{ maxWidth: 280 }}>
                    TX Hash: {hash}
                  </Text>
                </Space>
              </Card>
            )}
          </Space>
        </Card>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <DollarOutlined />
          Tokens
          {tokens && tokens.length > 0 && <Badge count={tokens.length} offset={[8, -2]} size="small" />}
        </span>
      ),
      children: (
        <Card bordered={false} className="tokens-card">
          {tokens && tokens.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={tokens}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Text strong>
                      {(Number(item.balance) / 10 ** Number(item.decimals)).toFixed(4)}
                    </Text>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={item.logo} 
                        icon={!item.logo && <DollarOutlined />}
                        style={{ backgroundColor: !item.logo ? '#000000' : 'transparent' }}
                      />
                    }
                    title={<span>{item.symbol} <Text type="secondary">({item.name})</Text></span>}
                    description={
                      <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                        {item.tokenAddress}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" align="center">
                  <Text>No tokens found in this wallet</Text>
                  <Button type="link" href="https://moralismoney.com/" target="_blank" style={{ color: "#000000" }}>
                    Find Alt Coin Gems at moralismoney.com
                  </Button>
                </Space>
              }
            />
          )}
        </Card>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <PictureOutlined />
          NFTs
          {nfts && nfts.length > 0 && <Badge count={nfts.length} offset={[8, -2]} size="small" />}
        </span>
      ),
      children: (
        <Card bordered={false} className="nfts-card">
          {nfts && nfts.length > 0 ? (
            <div className="nft-grid">
              {nfts.map((e, i) => (
                e && (
                  <Card
                    key={i}
                    hoverable
                    style={{ width: 150, marginBottom: 16, marginRight: 16 }}
                    cover={
                      <img
                        alt={`NFT ${i+1}`}
                        src={e}
                        style={{ height: 150, objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/150x150?text=NFT+Image';
                        }}
                      />
                    }
                  >
                    <Card.Meta title={`NFT #${i+1}`} />
                  </Card>
                )
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" align="center">
                  <Text>No NFTs found in this wallet</Text>
                  <Button type="link" href="https://moralismoney.com/" target="_blank" style={{ color: "#000000" }}>
                    Explore NFT Collections at moralismoney.com
                  </Button>
                </Space>
              }
            />
          )}
        </Card>
      ),
    },
  ];

  async function sendTransaction(to, amount) {
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
      
      notification.info({
        message: 'Transaction Sent',
        description: 'Your transaction has been submitted to the network',
        duration: 3,
      });
      
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        notification.success({
          message: 'Transaction Successful',
          description: 'Your transfer has been confirmed on the blockchain',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        getAccountTokens();
      } else {
        notification.error({
          message: 'Transaction Failed',
          description: 'Your transaction was unsuccessful. Please try again.',
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    } catch (err) {
      console.error("Transaction error:", err);
      notification.error({
        message: 'Transaction Error',
        description: err.message || 'An error occurred during the transaction',
        duration: 5,
      });
      
      setHash(null);
      setProcessing(false);
    }
  }

  async function getAccountTokens() {
    setFetching(true);
    
    try {
      const res = await axios.get(`http://localhost:3001/getTokens`, {
        params: {
          userAddress: wallet,
          chain: selectedChain,
        },
      });

      const response = res.data;

      if (response.tokens && response.tokens.length > 0) {
        setTokens(response.tokens);
      } else {
        setTokens([]);
      }

      if (response.nfts && response.nfts.length > 0) {
        setNfts(response.nfts);
      } else {
        setNfts([]);
      }

      setBalance(response.balance || 0);
    } catch (error) {
      console.error("Error fetching account data:", error);
      notification.error({
        message: 'Data Fetch Error',
        description: 'Failed to load wallet data. Please try again later.',
      });
      setTokens([]);
      setNfts([]);
    } finally {
      setFetching(false);
    }
  }

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    
    notification.info({
      message: 'Logged Out',
      description: 'You have been logged out of your wallet',
      placement: 'topRight',
    });
    
    navigate("/");
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, [wallet, selectedChain]);

  return (
    <div className="wallet-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card
        bordered={true}
        style={{ 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
          borderRadius: "12px", 
          overflow: "hidden" 
        }}
      >
        <div className="wallet-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Space>
            <WalletOutlined style={{ fontSize: "24px", color: "#000000" }} />
            <Title level={3} style={{ margin: 0, color: "#000000" }}>My Wallet</Title>
          </Space>
          
          <Space>
            <Tag color="black">
              {CHAINS_CONFIG[selectedChain].name}
            </Tag>
            <Button 
              type="text" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={logout}
              title="Logout"
            >
              Logout
            </Button>
          </Space>
        </div>
        
        <Card
          size="small"
          className="wallet-address-card"
          style={{ marginBottom: "16px", background: "#f5f5f5" }}
        >
          <Space>
            <Text type="secondary">Wallet Address:</Text>
            <Text strong ellipsis style={{ maxWidth: 280 }}>
              {wallet}
            </Text>
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />} 
              onClick={() => copyToClipboard(wallet)}
              title="Copy Address"
              style={{ color: "#000000" }}
            />
          </Space>
        </Card>

        {fetching ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <Text style={{ display: "block", marginTop: "16px" }}>Loading wallet data...</Text>
          </div>
        ) : (
          <Tabs 
            defaultActiveKey="1" 
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items} 
            type="card"
            style={{ marginTop: "16px" }}
          />
        )}
      </Card>
    </div>
  );
}

export default WalletView;