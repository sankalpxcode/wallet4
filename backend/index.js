const express = require("express");
const { ethers } = require("ethers");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3001;
const RPC_URL = process.env.RPC_URL;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true },
  nonce: { type: Number, default: Math.floor(Math.random() * 1000000) },
});

const User = mongoose.model("User", UserSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Ethereum provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ** Route to request a nonce for authentication **
app.get("/auth/nonce", async (req, res) => {
  const { walletAddress } = req.query;
  if (!walletAddress || !ethers.isAddress(walletAddress)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  let user = await User.findOne({ walletAddress });
  if (!user) {
    user = await User.create({ walletAddress });
  }

  return res.json({ nonce: user.nonce });
});

// ** Route to verify the signed message **
app.post("/auth/verify", async (req, res) => {
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) {
    return res.status(400).json({ error: "Missing data" });
  }

  const user = await User.findOne({ walletAddress });
  if (!user) return res.status(400).json({ error: "User not found" });

  const message = `Sign this message to verify your identity: ${user.nonce}`;
  const recoveredAddress = ethers.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
    return res.json({ success: true, message: "Authenticated" });
  } else {
    return res.status(401).json({ error: "Invalid signature" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
