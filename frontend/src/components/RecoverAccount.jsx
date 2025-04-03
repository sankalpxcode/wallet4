import React, { useState, useEffect } from "react";
import { BulbOutlined, KeyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, Alert, Steps, Typography, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const { TextArea } = Input;
const { Title, Text } = Typography;

function RecoverAccount({ setWallet, setSeedPhrase }) {
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [nonValid, setNonValid] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    // Count words and filter out empty spaces
    const words = typedSeed.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [typedSeed]);

  function seedAdjust(e) {
    setNonValid(false);
    setTypedSeed(e.target.value);
  }

  async function recoverWallet() {
    setIsRecovering(true);
    
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let recoveredWallet;
    try {
      recoveredWallet = ethers.Wallet.fromPhrase(typedSeed.trim());
      setSeedPhrase(typedSeed.trim());
      setWallet(recoveredWallet.address);
      navigate("/yourwallet");
    } catch (err) {
      setNonValid(true);
      setIsRecovering(false);
    }
  }

  return (
    <div className="recover-account-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Card 
        bordered={true} 
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <KeyOutlined style={{ fontSize: "24px", color: "#1890ff", marginRight: "12px" }} />
            <Title level={3} style={{ margin: 0 }}>Recover Your Wallet</Title>
          </div>
        }
      >
        <Steps
          size="small"
          current={0}
          items={[
            { title: "Enter Seed" },
            { title: "Verify" },
            { title: "Access Wallet" }
          ]}
          style={{ marginBottom: "24px" }}
        />

        <Alert
          icon={<BulbOutlined />}
          type="info"
          showIcon
          message="Seed Phrase Recovery"
          description="Enter your 12-word seed phrase below, with words separated by spaces. This will restore access to your wallet and funds."
          style={{ marginBottom: "16px" }}
        />

        <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
          <Text>Your Seed Phrase</Text>
          <Text type={wordCount === 12 ? "success" : "secondary"}>
            {wordCount}/12 words
          </Text>
        </div>

        <TextArea
          value={typedSeed}
          onChange={seedAdjust}
          rows={4}
          className="seedPhraseContainer"
          placeholder="Type your seed phrase here... (12 words separated by spaces)"
          style={{ 
            marginBottom: "16px", 
            borderRadius: "8px", 
            fontFamily: "monospace", 
            fontSize: "16px",
            background: "#f8f9fa"
          }}
        />

        {nonValid && (
          <Alert
            message="Invalid Seed Phrase"
            description="The seed phrase you entered is not valid. Please check for typos and try again."
            type="error"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
          >
            Back Home
          </Button>
          
          <Button
            type="primary"
            disabled={wordCount !== 12}
            onClick={recoverWallet}
            loading={isRecovering}
            icon={<KeyOutlined />}
            style={{ 
              minWidth: "160px",
              height: "40px",
              borderRadius: "8px",
              fontWeight: "500"
            }}
          >
            {isRecovering ? "Recovering..." : "Recover Wallet"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default RecoverAccount;