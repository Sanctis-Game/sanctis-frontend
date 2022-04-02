import { useContext } from "react";

import { ConfirmationModalContext } from "../contexts/ConfirmationModal";

const useConfirmationModal = () => {
  return {
    ...useContext(ConfirmationModalContext),
  };
};

export default useConfirmationModal;
