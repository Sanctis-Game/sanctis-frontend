import {
  IconButton,
  Flex,
  HStack,
  useColorModeValue,
  Text,
  FlexProps,
  Button,
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalBody,
  Box,
  ModalOverlay,
} from "@chakra-ui/react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { FiMenu } from "react-icons/fi";
import { GrConnect } from "react-icons/gr";
import { CommanderBadge } from "./CommanderBadge";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { useCallback, useEffect } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { NetworkPicker } from "./NetworkPicker";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const validConnectors = [{ name: "MetaMask", id: "injected" }];

const autoconnectPeriod = 86400000;
const startAutoconnect = Date.now();

export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { account, connect } = useWallet();
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const [autoconnect, setAutoconnect] = useLocalStorage("autoconnectExpirationDate", startAutoconnect);
  const [connector, setConnector] = useLocalStorage<string | undefined>("connector", undefined);

  const handleChooseWallet = useCallback(async () => {
    openModal();
  }, [openModal]);

  const handleConnect = useCallback(
    async (id: string) => {
      await connect(id as any);
      setAutoconnect(Date.now() + autoconnectPeriod);
      setConnector(id);
      onClose();
    },
    [connect, onClose, setAutoconnect, setConnector]
  );

  useEffect(() => {
    if (!connector) return;
    if (autoconnect > Date.now() && !account) {
      connect(connector as any);
    }
  }, [account, autoconnect, connector, connect, handleConnect]);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <ColorModeSwitcher />
        <NetworkPicker />
        {account ? (
          <CommanderBadge setAutoconnect={setAutoconnect} />
        ) : (
          <Button
            size="lg"
            variant="ghost"
            aria-label="open menu"
            leftIcon={<GrConnect />}
            onClick={handleChooseWallet}
          >
            Connect
          </Button>
        )}
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Choose a wallet</ModalHeader>
          <ModalBody>
            {Object.values(validConnectors).map((connector) => (
              <Button key={connector.id} isFullWidth onClick={() => handleConnect(connector.id)}>
                <Box>{connector.name}</Box>
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
