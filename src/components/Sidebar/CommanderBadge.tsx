import React, { useCallback } from 'react';
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
} from '@chakra-ui/react';
import {
  FiChevronDown,
} from 'react-icons/fi';
import { useWallet } from '@binance-chain/bsc-use-wallet';
import { shortAddress } from 'utils';
import numeral from 'numeral';
import useSanctis from 'hooks/useSanctis';

export const CommanderBadge: React.FC<{ setAutoconnect: (date: number) => void }> = ({ setAutoconnect }) => {
  const { reset, account } = useWallet()
  const { ownedCredits } = useSanctis()

  const handleReset = useCallback(() => {
    setAutoconnect(Date.now())
    reset()
  }, [setAutoconnect, reset])

  return (
    <Flex alignItems={'center'}>
      <Menu>
        <MenuButton
          py={2}
          transition="all 0.3s"
          _focus={{ boxShadow: 'none' }}>
          <HStack>
            <Avatar
              size={'sm'}
              src={
                'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
              }
            />
            <VStack
              display={{ base: 'none', md: 'flex' }}
              alignItems="flex-start"
              spacing="1px"
              ml="2">
              <Text fontSize="sm">{shortAddress(account || "")}</Text>
              <Text fontSize="xs" color="gray.600">
                {ownedCredits ? numeral(ownedCredits).format("0.00aa") : "???"} $CREDS
              </Text>
            </VStack>
            <Box display={{ base: 'none', md: 'flex' }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList
          bg={useColorModeValue('white', 'gray.900')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Billdding</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleReset}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};