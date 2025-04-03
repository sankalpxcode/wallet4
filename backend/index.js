const express = require("express");
const { ethers } = require("ethers");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = 3001;

// Replace with your RPC URL (Infura, Alchemy, etc.)
const RPC_URL = process.env.RPC_URL;

// Connect to Ethereum provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

app.use(cors());
app.use(express.json());

app.get("/getTokens", async (req, res) => {
  try {
    const { userAddress, chain } = req.query;

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    // Fetch Native Balance
    const balance = await provider.getBalance(userAddress);
    const nativeBalance = ethers.formatEther(balance);

    // Token Balances: Requires Smart Contract interaction (ERC-20 tokens)
    // Here you would query ERC-20 contract addresses manually

    // NFTs: Requires an NFT marketplace API or a custom contract query

    const jsonResponse = {
      tokens: [], // Need a method to fetch ERC-20 balances
      nfts: [],   // Need a method to fetch NFTs
      balance: nativeBalance
    };

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
