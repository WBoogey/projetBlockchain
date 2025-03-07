import React, { useState } from 'react';
import { Wallet, Coins, Vote, LineChart, UserCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Staking from './components/Staking';
import Governance from './components/Governance';
import Profile from './components/Profile';
import TokenStats from './components/TokenStats';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
            <div className="flex items-center">
              <span className="text-xl font-bold">MyToken DApp</span>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Connecter Wallet
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 h-[calc(100vh-4rem)] p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <Wallet size={20} />
              <span>Tableau de bord</span>
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'staking' ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <Coins size={20} />
              <span>Staking</span>
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'governance' ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <Vote size={20} />
              <span>Gouvernance</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'stats' ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <LineChart size={20} />
              <span>Statistiques</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <UserCircle size={20} />
              <span>Profil</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;