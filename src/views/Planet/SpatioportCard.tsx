import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Divider, Input, Select, Stack, Text, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react'
import ResourceBadge from 'components/ResourceBadge'
import { BigNumber } from 'ethers'
import React, { useState } from 'react'

import { Infrastructure, Planet, Ship } from '../../contexts/Sanctis/types'
import useApprovedObjects from '../../hooks/useApprovedObjects'
import useSpatioport from '../../hooks/useSpatioport'

const SpatioportCard: React.FC<{ infrastructure: Infrastructure; planet: Planet }> = ({ infrastructure, planet }) => {
  const { ships } = useApprovedObjects();
  const { getBlockNumber } = useWallet();
  const { spatioport, upgrade, build } = useSpatioport(infrastructure, planet.id);
  const [choice, setChoice] = useState<Ship>(ships[0]);
  const [quantity, setQuantity] = useState<number>(0);

  return (
    <Stack spacing={3} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl" shadow={"xl"}>
      <Text fontWeight="bold" fontSize="xl">
        {infrastructure.name}
      </Text>
      <Text fontWeight="bold" fontSize="xl">
        {infrastructure.description}
      </Text>
      <Text fontWeight="bold" fontSize="xl" textAlign="start">
        Level: {infrastructure.level}
      </Text>
      <Select onChange={(e) => setChoice(JSON.parse(e.target.value))}>
        {ships.map((e) => (
          <option key={e.address} value={JSON.stringify(e)}>
            {e.name}
          </option>
        ))}
      </Select>
      <Input type="number" onChange={(e) => setQuantity(Number(e.target.value))} />
      <Button
        rounded={"full"}
        px={6}
        colorScheme={"blue"}
        bg={useColorModeValue("gray.300", "gray.500")}
        _hover={{ bg: useColorModeValue("gray.400", "gray.400") }}
        onClick={() => build(planet.id, choice, quantity)}
        disabled={!quantity}
      >
        Build
      </Button>
      <Divider />
      <Stack spacing={2} justify={"center"}>
        <Text fontWeight="bold" fontSize="xl" textAlign="start">
          Upgrade costs:
        </Text>
        <Wrap>
          {(infrastructure.nextCosts || []).map((cost, i) => (
            <WrapItem key={infrastructure.costsResources![i].name}>
              <ResourceBadge resource={infrastructure.costsResources![i]} amount={BigNumber.from(cost)} />
            </WrapItem>
          ))}
        </Wrap>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"blue"}
          bg={useColorModeValue("gray.300", "gray.500")}
          _hover={{ bg: useColorModeValue("gray.400", "gray.400") }}
          onClick={() => upgrade(planet.id)}
          disabled={getBlockNumber() < spatioport.nextUpgrade!}
        >
          {getBlockNumber() < spatioport.nextUpgrade!
            ? `Upgradable in ${spatioport.nextUpgrade! - getBlockNumber()} blocks`
            : "Upgrade"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SpatioportCard;
