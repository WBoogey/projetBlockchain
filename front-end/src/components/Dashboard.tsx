import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownRight, Wallet, RefreshCw } from 'lucide-react';

interface DashboardProps {
  userAddress: string;  // User's Ethereum address passed as a prop
}

const Dashboard: React.FC<DashboardProps> = ({ userAddress }) => {
  const [mtkBalance, setMtkBalance] = useState<string>('0.00');
  const [ethBalance, setEthBalance] = useState<string>('2.5');  // Assuming static ETH balance for now
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch MTK balance
  const fetchMtkBalance = async () => {
    if (!userAddress) return;
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/token/balance/${userAddress}`);
      setMtkBalance(parseFloat(response.data.balance).toFixed(2));
    } catch (err) {
      console.error('Error fetching MTK balance:', err);
      setError('Failed to fetch MTK balance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMtkBalance();  // Fetch balance on component mount
  }, [userAddress]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="text-indigo-400" size={24} />
              <h3 className="text-lg font-medium">Solde MTK</h3>
            </div>
            <RefreshCw
              size={20}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={fetchMtkBalance}
            />
          </div>
          <p className="text-3xl font-bold mt-4">
            {loading ? 'Loading...' : `${mtkBalance} MTK`}
          </p>
          <div className="flex items-center mt-2 text-green-400">
            <ArrowUpRight size={16} />
            <span className="text-sm">+2.5% aujourd'hui</span>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="text-indigo-400" size={24} />
              <h3 className="text-lg font-medium">Solde ETH</h3>
            </div>
            <RefreshCw size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
          <p className="text-3xl font-bold mt-4">{ethBalance} ETH</p>
          <div className="flex items-center mt-2 text-red-400">
            <ArrowDownRight size={16} />
            <span className="text-sm">-1.2% aujourd'hui</span>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="text-indigo-400" size={24} />
              <h3 className="text-lg font-medium">Valeur Totale</h3>
            </div>
            <RefreshCw size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
          <p className="text-3xl font-bold mt-4">${(parseFloat(mtkBalance) * 1.2).toFixed(2)}</p>
          <div className="flex items-center mt-2 text-green-400">
            <ArrowUpRight size={16} />
            <span className="text-sm">+1.8% aujourd'hui</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;