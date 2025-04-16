import React from "react";
import { 
  Button, 
  Typography, 
  Card, 
  Space, 
  Divider,
  Row,
  Col
} from "antd";
import { 
  PlusCircleOutlined, 
  KeyOutlined, 
  WalletOutlined, 
  SafetyOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card 
        bordered={true} 
        style={{ 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
          borderRadius: "12px", 
          overflow: "hidden",
          background: "#ffffff"
        }}
      >
        <div className="hero-section" style={{ textAlign: "center", marginBottom: "24px" }}>
          <WalletOutlined style={{ fontSize: "64px", color: "#000000", marginBottom: "16px" }} />
          <Title level={2} style={{ marginBottom: "8px", color: "#000000" }}>Cryptex</Title>
        </div>

        <Divider />

        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <Card 
              hoverable 
              style={{ height: "100%" }}
              onClick={() => navigate('/yourwallet')}
            >
              <Space direction="vertical" size="middle" style={{ display: 'flex', alignItems: 'center' }}>
                <PlusCircleOutlined style={{ fontSize: "36px", color: "#000000" }} />
                <Title level={4} style={{ color: "#000000" }}>Create A Wallet</Title>
                <Paragraph style={{ textAlign: "center" }}>
                  Generate a new wallet with a unique address and seed phrase
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlusCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/yourwallet');
                  }}
                  style={{ 
                    width: "80%",
                    backgroundColor: "#000000", 
                    borderColor: "#000000"
                  }}
                >
                  Create Wallet
                </Button>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              hoverable 
              style={{ height: "100%" }}
              onClick={() => navigate('/recover')}
            >
              <Space direction="vertical" size="middle" style={{ display: 'flex', alignItems: 'center' }}>
                <KeyOutlined style={{ fontSize: "36px", color: "#000000" }} />
                <Title level={4} style={{ color: "#000000" }}>Recover Existing Wallet</Title>
                <Paragraph style={{ textAlign: "center" }}>
                  Access your wallet using your 12-word seed phrase
                </Paragraph>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<KeyOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/recover');
                  }}
                  style={{ 
                    width: "80%",
                    borderColor: "#000000",
                    color: "#000000"
                  }}
                >
                  Recover Wallet
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div className="info-section" style={{ marginTop: "24px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card size="small">
                <Space align="start">
                  <SafetyOutlined style={{ fontSize: "24px", color: "#000000" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>Secure Storage</Text>
                    <Text type="secondary">Your keys never leave your device</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small">
                <Space align="start">
                  <WalletOutlined style={{ fontSize: "24px", color: "#000000" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>Multi-Chain Support</Text>
                    <Text type="secondary">Access multiple blockchains</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small">
                <Space align="start">
                  <QuestionCircleOutlined style={{ fontSize: "24px", color: "#000000" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>Need Help?</Text>
                    <Text type="secondary">
                      <a href="https://your-custom-link.com" target="_blank" rel="noreferrer" style={{ color: "#000000" }}>
                        Visit Our Docs
                      </a>
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="footer" style={{ marginTop: "32px", textAlign: "center" }}>
          <Text type="secondary">
            Learn more about Web3 Wallets at{" "}
            <a href="https://your-custom-link.com" target="_blank" rel="noreferrer" style={{ color: "#000000" }}>
              our documentation
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default Home;