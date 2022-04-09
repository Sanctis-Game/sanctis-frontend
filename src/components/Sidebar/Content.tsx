import React from "react";
import { Box, CloseButton, Flex, useColorModeValue, Text, BoxProps, Image } from "@chakra-ui/react";
import { NavItem } from "./Item";
import { LinkItems } from "./items";
import logo from "../../assets/black-hole-space-svgrepo-com.png";

export interface SidebarProps extends BoxProps {
  onClose: () => void;
}
export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={logo} rounded="full" maxW="48px" />
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Sanctis
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} url={link.url}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};
