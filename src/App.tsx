import React from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'

import Sidebar from "./components/Sidebar";
import Home from "./views/Home";
import Planet from "./views/Planet";
import useChainPicker from "./hooks/useChainPicker";
import ChainPickerProvider from "./contexts/ChainPicker";
import ConfirmationModalProvider from "./contexts/ConfirmationModal";
import SanctisProvider from "./contexts/Sanctis";
import Commanders from "views/Commanders";
import Commander from "views/Commander";

const WalletProvider: React.FC = ({ children }) => {
  const { chainId } = useChainPicker()

  return <UseWalletProvider chainId={chainId}>{children}</UseWalletProvider>
}

const Providers: React.FC = ({ children }) => {

  return (
    <ChakraProvider>
      <ChainPickerProvider>
        <WalletProvider>
          <ConfirmationModalProvider>
            <SanctisProvider>
              {children}
            </SanctisProvider>
          </ConfirmationModalProvider>
        </WalletProvider>
      </ChainPickerProvider>
    </ChakraProvider>
  );
};

function App() {
  return (
    <Providers>
      <Sidebar>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commanders" element={<Commanders />} />
            <Route path="/commander/:id" element={<Commander />} />
            <Route path="/planet/:id" element={<Planet />} />
          </Routes>
        </Router>
      </Sidebar>
    </Providers>
  );
}

export default App;