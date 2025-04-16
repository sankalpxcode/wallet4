import React, { useState } from "react";
import { 
  Button, 
  Card, 
  Typography, 
  Steps, 
  Alert, 
  Space, 
  Divider, 
  Tooltip, 
  message,
  Spin
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  KeyOutlined, 
  CopyOutlined, 
  ArrowLeftOutlined,
  CheckCircleFilled,
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';

const { Title, Text, Paragraph } = Typography;

function CreateAccount({ setWallet, setSeedPhrase }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  async function generateWallet() {
    setLoading(true);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhrase(mnemonic);
    setLoading(false);
    setCurrentStep(1);
  }

  function setWalletAndMnemonic() {
    if (!newSeedPhrase) {
      message.error("Please generate a seed phrase first");
      return;
    }
    
    setSeedPhrase(newSeedPhrase);
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
    
    message.success("Wallet created successfully!");
    navigate("/yourwallet");
  }

  const copyToClipboard = () => {
    if (!newSeedPhrase) return;
    
    navigator.clipboard.writeText(newSeedPhrase);
    setIsCopied(true);
    message.success("Seed phrase copied to clipboard");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="create-account-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Card 
        bordered={true} 
        style={{ 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
          borderRadius: "12px",
          background: "#ffffff" 
        }}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <KeyOutlined style={{ fontSize: "24px", color: "#000000", marginRight: "12px" }} />
            <Title level={3} style={{ margin: 0, color: "#000000" }}>Create New Wallet</Title>
          </div>
        }
      >
        <Steps
          current={currentStep}
          items={[
            {
              title: 'Generate',
              description: 'Create seed phrase',
              icon: <KeyOutlined />
            },
            {
              title: 'Secure',
              description: 'Save your seed phrase',
              icon: <SafetyOutlined />
            },
            {
              title: 'Access',
              description: 'Open your wallet',
              icon: <CheckCircleFilled />
            },
          ]}
          style={{ marginBottom: "24px" }}
        />

        <Alert
          message="Important Security Information"
          description={
            <Paragraph>
              Your seed phrase is the master key to your wallet. Anyone with this phrase can access and control your funds.
              <ul>
                <li>Write it down and store it in a secure location</li>
                <li>Never share it with anyone</li>
                <li>Anthropic cannot recover your seed phrase if lost</li>
              </ul>
            </Paragraph>
          }
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: "24px" }}
        />

        {!newSeedPhrase ? (
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Button
              type="primary"
              size="large"
              icon={<KeyOutlined />}
              onClick={generateWallet}
              loading={loading}
              style={{ 
                height: "48px", 
                width: "100%", 
                maxWidth: "320px",
                borderRadius: "8px",
                fontWeight: "500",
                background: "#000000",
                borderColor: "#000000"
              }}
            >
              {loading ? "Generating Secure Seed Phrase..." : "Generate Seed Phrase"}
            </Button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text strong>Your Seed Phrase (12 words)</Text>
              <Space>
                <Tooltip title={isVisible ? "Hide seed phrase" : "Show seed phrase"}>
                  <Button
                    type="text"
                    icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={toggleVisibility}
                    size="small"
                    style={{ color: "#000000" }}
                  />
                </Tooltip>
                <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"}>
                  <Button
                    type="text"
                    icon={isCopied ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                    onClick={copyToClipboard}
                    size="small"
                    style={{ color: "#000000" }}
                  />
                </Tooltip>
              </Space>
            </div>

            <Card 
              className="seed-phrase-card" 
              style={{ 
                marginBottom: "24px", 
                background: "#f9f9f9",
                border: "1px dashed #d9d9d9",
                position: "relative"
              }}
            >
              {isVisible ? (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(3, 1fr)", 
                  gap: "8px" 
                }}>
                  {newSeedPhrase.split(" ").map((word, index) => (
                    <div key={index} style={{ 
                      padding: "8px", 
                      background: "#fff", 
                      borderRadius: "4px",
                      border: "1px solid #d9d9d9"
                    }}>
                      <Text type="secondary" style={{ marginRight: "4px" }}>{index + 1}.</Text>
                      <Text>{word}</Text>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: "center", 
                  padding: "40px 0",
                  color: "#bfbfbf"
                }}>
                  <LockOutlined style={{ fontSize: "32px" }} />
                  <Text style={{ display: "block", marginTop: "12px" }}>Seed phrase hidden for security</Text>
                </div>
              )}
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
                style={{
                  borderColor: "#000000",
                  color: "#000000"
                }}
              >
                Back Home
              </Button>
              
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleFilled />}
                onClick={setWalletAndMnemonic}
                style={{ 
                  minWidth: "200px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  background: "#000000",
                  borderColor: "#000000"
                }}
              >
                Create My Wallet
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default CreateAccount;