import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="text-indigo-400" size={24} />
              <h3 className="text-lg font-medium">Solde MTK</h3>
            </div>
            <RefreshCw size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
          <p className="text-3xl font-bold mt-4">1,234.56 MTK</p>
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
          <p className="text-3xl font-bold mt-4">2.5 ETH</p>
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
          <p className="text-3xl font-bold mt-4">$5,678.90</p>
          <div className="flex items-center mt-2 text-green-400">
            <ArrowUpRight size={16} />
            <span className="text-sm">+1.8% aujourd'hui</span>
          </div>
        </div>
      </div>

      {/* Transfer Section */}
      <div className="bg-gray-800 p-6 rounded-xl mt-6">
        <h2 className="text-xl font-bold mb-4">Transfert de Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Adresse du destinataire
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Montant (MTK)
            </label>
            <input
              type="number"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>
        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium transition-colors">
          Envoyer
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 p-6 rounded-xl mt-6">
        <h2 className="text-xl font-bold mb-4">Transactions Récentes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${index % 2 === 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {index % 2 === 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p className="font-medium">{index % 2 === 0 ? 'Reçu' : 'Envoyé'}</p>
                  <p className="text-sm text-gray-400">Il y a {index + 1} heures</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{index % 2 === 0 ? '+100.00' : '-50.00'} MTK</p>
                <p className="text-sm text-gray-400">$123.45</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;