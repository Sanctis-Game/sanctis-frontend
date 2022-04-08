import React from "react";
import {
  useColorModeValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  IconButton,
  Badge,
  MenuDivider,
} from "@chakra-ui/react";
import { BiNetworkChart } from "react-icons/bi";

import useChainPicker from "../../hooks/useChainPicker";
import { supportedNetworks } from "../../constants";

export const NetworkPicker: React.FC = () => {
  const { chainId, setNetwork } = useChainPicker();

  return (
    <Menu>
      <IconButton
        as={MenuButton}
        p={3}
        transition="all 0.3s"
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        icon={<BiNetworkChart />}
        aria-label={`Switch network`}
      />
      <MenuList bg={useColorModeValue("white", "gray.900")} borderColor={useColorModeValue("gray.200", "gray.700")}>
        <MenuGroup title="Networks">
          <MenuDivider />
          {supportedNetworks.map((e) => (
            <MenuItem key={e.name || "" + e.chainId} onClick={() => setNetwork(e)}>
              {e.chainId === chainId && <Badge>Selected</Badge>} {e.name}
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
