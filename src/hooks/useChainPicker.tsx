import { useContext } from "react";

import { ChainPickerContext } from "../contexts/ChainPicker";

const useChainPicker = () => {
  return {
    ...useContext(ChainPickerContext),
  };
};

export default useChainPicker;
