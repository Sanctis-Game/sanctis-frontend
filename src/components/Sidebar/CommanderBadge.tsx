import React, { useCallback } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuGroup,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { shortAddress } from "utils";
import numeral from "numeral";
import useSanctis from "hooks/useSanctis";

import commanderIcon from "../../assets/character.svg";

export const CommanderBadge: React.FC<{ setAutoconnect: (date: number) => void }> = ({ setAutoconnect }) => {
  const { reset, account } = useWallet();
  const { ownedCredits, ownedCommanders, currentCommander, setCurrentCommander } = useSanctis();

  const handleReset = useCallback(() => {
    setAutoconnect(Date.now());
    reset();
  }, [setAutoconnect, reset]);

  return (
    <Flex alignItems={"center"}>
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
          <HStack>
            <Avatar size={"sm"} src={commanderIcon} />
            <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
              <Text fontSize="sm">{currentCommander ? currentCommander.name : shortAddress(account || "")}</Text>
              <Text fontSize="xs" color="gray.600">
                {ownedCredits ? numeral(ownedCredits).format("0.00aa") : "???"} $CREDS
              </Text>
            </VStack>
            <Box display={{ base: "none", md: "flex" }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList bg={useColorModeValue("white", "gray.900")} borderColor={useColorModeValue("gray.200", "gray.700")}>
          <MenuGroup title="Commanders">
            {[
              ownedCommanders &&
                ownedCommanders.map((e) => (
                  <MenuItem key={e.name || "" + e.id} onClick={() => setCurrentCommander(e)}>
                    {e.name}
                  </MenuItem>
                )),
              <MenuItem key={"create"}>Create a commander</MenuItem>,
            ]}
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Wallet">
            <MenuItem onClick={handleReset}>Disconnect</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
};
