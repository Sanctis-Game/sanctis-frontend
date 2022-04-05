import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Divider, Flex, Stack, Text, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react'
import ResourceBadge from 'components/ResourceBadge'
import { BigNumber } from 'ethers'
import usePowerPlant from 'hooks/usePowerPlant'
import React from 'react'

import { Infrastructure, Planet } from '../../contexts/Sanctis/types'

const PowerPlantCard: React.FC<{ infrastructure: Infrastructure; planet: Planet }> = ({ infrastructure, planet }) => {
  const { getBlockNumber } = useWallet();
  const { powerPlant, upgrade } = usePowerPlant(infrastructure, planet.id);

  return (
    <Stack spacing={3} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl" shadow={"xl"}>
      <Text fontWeight="bold" fontSize="xl">
        {powerPlant.name}
      </Text>
      <Text fontSize="md">{powerPlant.description}</Text>
      <Text fontWeight="bold" fontSize="md" textAlign="start">
        Level: {powerPlant.level}
      </Text>
      <Text fontWeight="bold" fontSize="md" textAlign="start">
        Pending:
      </Text>
      {powerPlant.energy && powerPlant.currentProduction && (
        <Flex direction={"row"}>
          <ResourceBadge resource={powerPlant.energy} amount={BigNumber.from(powerPlant.currentProduction)} size="sm" />
        </Flex>
      )}
      <Divider />
      <Stack spacing={2} justify={"center"}>
        <Text fontWeight="bold" fontSize="xl" textAlign="start">
          Upgrade costs:
        </Text>
        <Wrap>
          {(powerPlant.nextCosts || []).map((cost, i) => (
            <WrapItem key={powerPlant.costsResources![i].name}>
              <ResourceBadge resource={powerPlant.costsResources![i]} amount={BigNumber.from(cost)} size="sm" />
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
          disabled={getBlockNumber() < powerPlant.nextUpgrade!}
        >
          {getBlockNumber() < powerPlant.nextUpgrade!
            ? `Upgradable in ${powerPlant.nextUpgrade! - getBlockNumber()} blocks`
            : "Upgrade"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default PowerPlantCard;
