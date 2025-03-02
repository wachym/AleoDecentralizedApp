import { useMemo, useState } from "react";
import { useSelect, WalletProvider, useAccount, useConnect, useDisconnect, useRecords } from "aleo-hooks";
import WalletModal from "./components/WalletModal";
import './App.css';

import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
  configureConnectionForPuzzle
} from 'aleo-adapters';
import Header from "./components/Header";

function ConnectWalletButton() {
  const account = useAccount();
  const { connect, address, connected, connecting, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { select } = useSelect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWalletSelect = (walletId) => {
    const walletAdapterMap = {
      'leo-wallet': 'Leo Wallet',
      'puzzle-wallet': 'Puzzle Wallet',
      'fox-wallet': 'Fox Wallet',
      'soter-wallet': 'Soter Wallet',
    };

    const adapterId = walletAdapterMap[walletId];

    if (!adapterId) {
      console.error(`Unsupported wallet ID: ${walletId}`);
      return;
    }

    select(adapterId);
    setIsModalOpen(false);

    setTimeout(() => {
      connect(adapterId);
    }, 100);
  };

  const handleClick = () => {
    if (account?.deleted) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">
          Aleo App
        </div>
        <nav className="hidden md:flex space-x-4"></nav>
        <ConnectWalletButton/>
      </header>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
        onClick={handleClick}
      >
        {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWalletSelect={handleWalletSelect}
      />
    </div>
  );
} 

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Aleo app',
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          ['AleoMainnet']: ['dApp_1.aleo', 'dApp_1_import.aleo', 'dApp_1_import_2.aleo'],
          ['AleoTestnet']: ['dApp_1_test.aleo', 'dApp_1_test_import.aleo', 'dApp_1_test_import_2.aleo']
        },
        appName: 'Aleo app',
        appDescription: 'A privacy-focused DeFi app',
        appIconUrl: ''
      }),
      new FoxWalletAdapter({
        appName: 'Aleo app',
      }),
      new SoterWalletAdapter({
        appName: 'Aleo app',
      })
    ],
    [],
  );

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <div className="App bg-gray-50 min-h-screen">
        <main className="container mx-auto py-10 flex flex-col items-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Alpha Credential</h1>
          <ConnectWalletButton />
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
