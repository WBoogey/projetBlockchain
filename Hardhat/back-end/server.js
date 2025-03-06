require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key';
const MESSAGE = "Please sign this message to log in";
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenContract = new ethers.Contract(TOKEN_ADDRESS, [
    "function transfer(address to, uint256 amount) public returns (bool)"
], wallet);

// 🚀 Route 1: Request Message for Authentication
app.post('/api/request-message', (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ message: "Ethereum address is required" });
    }
    return res.json({ message: MESSAGE });
});

// 🚀 Route 2: Authenticate with MetaMask Signature
app.post('/api/authenticate', async (req, res) => {
    const { address, signature } = req.body;
    try {
        const recoveredAddress = ethers.utils.verifyMessage(MESSAGE, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(400).json({ message: "Invalid signature" });
        }
        const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// 🛡 Middleware: Verify JWT Token
const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// 🚀 Route 3: Transfer Tokens
app.post('/api/transfer', verifyJWT, async (req, res) => {
    const { recipient, amount } = req.body;
    if (!recipient || !amount) {
        return res.status(400).json({ message: "Recipient address and amount are required" });
    }

    try {
        const tx = await tokenContract.transfer(recipient, ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        res.json({ message: "Transfer successful", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ message: "Transfer failed", error: error.message });
    }
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
