import { useDisclosure } from "@chakra-ui/react";
import ConfirmationModal from "components/ConfirmationModal";
import React, { createContext, useCallback } from "react";

export interface ConfirmationModalContextValues {
  confirming: boolean
  open: (action: () => Promise<void>, onClose?: () => Promise<void>) => Promise<void>
}

export const ConfirmationModalContext = createContext<ConfirmationModalContextValues>({
  confirming: false,
  open: () => new Promise(() => {})
})

export const ChainPickerProvider: React.FC = ({ children }) => {
  const { isOpen: confirming, onOpen, onClose: onCloseModal } = useDisclosure();

  const open = useCallback(async (action: () => Promise<void>, onClose?: () => Promise<void>) => {
    onOpen()
    await action()
    if (onClose) await onClose()
    onCloseModal()
  }, [onOpen, onCloseModal])

  return (
    <ConfirmationModalContext.Provider
      value={{ confirming, open }}
    >
      {children}
      <ConfirmationModal isOpen={confirming} onClose={onCloseModal} />
    </ConfirmationModalContext.Provider>
  );
};

export default ChainPickerProvider;
