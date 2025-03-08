import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';  // FIX: Import Web3Provider separately
import { Wallet, Coins, Vote, LineChart, UserCircle } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import Staking from '../components/Staking';
import Governance from '../components/Governance';
import Profile from '../components/Profile';
import TokenStats from '../components/TokenStats';
import { abi } from '../../contrats/contrat';  // Ensure the ABI file path is correct

// ERC20 Contract Address
const tokenAddress = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';  // Replace with your actual contract address

function MyTokenApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  // Connect to MetaMask and get token balance
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new Web3Provider(window.ethereum);  // FIX: Use Web3Provider instead of ethers.providers.Web3Provider
        await provider.send("eth_requestAccounts", []);  // Request MetaMask connection
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

        const balance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();
        const balanceFormatted = ethers.utils.formatUnits(balance, decimals);

        setTokenBalance(parseFloat(balanceFormatted).toFixed(4));
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  // Send tokens using transferBetweenUsers
  const sendTokens = async () => {
    if (!recipient || !amount) {
      alert("Please enter a valid recipient address and amount.");
      return;
    }
    try {
      const provider = new Web3Provider(window.ethereum);  // FIX: Use Web3Provider instead of ethers.providers.Web3Provider
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);

      const tx = await tokenContract.transferBetweenUsers(recipient, amountInWei);
      await tx.wait();

      alert(`Transaction successful: ${tx.hash}`);
      connectWallet();  // Update balance after sending tokens
    } catch (error) {
      console.error("Error sending tokens:", error);
      alert("Error sending tokens.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'staking':
        return <Staking />;
      case 'governance':
        return <Governance />;
      case 'stats':
        return <TokenStats />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold">MyToken DApp</span>
            <div className="flex items-center space-x-4">
              {walletAddress && tokenBalance && (
                <span className="text-sm text-gray-300">
                  Balance: {tokenBalance} MTK
                </span>
              )}
              <button
                onClick={connectWallet}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {walletAddress
                  ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-8">
        {walletAddress && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Send Tokens</h2>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mb-2 p-2 rounded-lg bg-gray-700 text-white w-full"
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-2 p-2 rounded-lg bg-gray-700 text-white w-full"
            />
            <button
              onClick={sendTokens}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
            >
              Send
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}

export default MyTokenApp