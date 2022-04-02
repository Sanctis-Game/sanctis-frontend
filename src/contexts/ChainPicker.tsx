import React, { createContext } from "react";

import { supportedNetworks, Network } from "../constants";
import useLocalStorage from "../hooks/useLocalStorage";

export interface ChainPickerContextValues extends Network {
  setNetwork: (network: Network) => void
}

export const ChainPickerContext = createContext<ChainPickerContextValues>({
  ...supportedNetworks[0],
  setNetwork: () => {}
})

export const ChainPickerProvider: React.FC = ({ children }) => {
  const [network, setNetwork] = useLocalStorage<Network>("network", supportedNetworks[0])

  return (
    <ChainPickerContext.Provider
      value={{ ...network, setNetwork }}
    >
      {children}
    </ChainPickerContext.Provider>
  );
};

export default ChainPickerProvider;
