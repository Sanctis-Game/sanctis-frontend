import React from "react";
import { Button, Divider, Stack, Text, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";

import { Planet, Infrastructure } from "../../contexts/Sanctis/types";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import useResourceProducer from "hooks/useResourceProducer";
import ResourceBadge from "components/ResourceBadge";
import { BigNumber } from "ethers";

const ResourceProducerCard: React.FC<{ infrastructure: Infrastructure, planet: Planet }> = ({ infrastructure, planet }) => {
  const { getBlockNumber } = useWallet()
  const { producer, upgrade, harvest } = useResourceProducer(infrastructure, planet.id)
  return (
    <Stack spacing={6} background={useColorModeValue('white', 'gray.800')} p="5" rounded="xl" shadow={"xl"}>
      <Text fontWeight="bold" fontSize="xl">{producer.name}</Text>
      <Text fontWeight="bold" fontSize="xl">{producer.description}</Text>
      <Text fontWeight="bold" fontSize="xl" textAlign="start">Level: {producer.level}</Text>
      <Text fontWeight="bold" fontSize="xl" textAlign="start">Pending:</Text>
      <Wrap>
        {(producer.productionPerBlock || []).map((prod, i) =>
          <WrapItem key={producer.producedResources![i].name}>
            <ResourceBadge resource={producer.producedResources![i]} amount={BigNumber.from(prod).mul(Math.max(0, (getBlockNumber() - producer.lastHarvest!)))} />
          </WrapItem>
        )}
      </Wrap>
      <Button
        rounded={"full"}
        px={6}
        bg={"blue.400"}
        _hover={{ bg: "blue.500" }}
        colorScheme={"blue"}
        onClick={() => harvest(planet.id)}
        disabled={getBlockNumber() < producer.lastHarvest!}
      >
        {getBlockNumber() < producer.lastHarvest! ? `Harvestable in ${producer.lastHarvest! - getBlockNumber()} blocks` : "Harvest"}
      </Button>
      <Divider />
      <Stack spacing={2} justify={"center"}>
        <Text fontWeight="bold" fontSize="xl" textAlign="start">Upgrade costs:</Text>
        <Wrap>
          {(producer.nextCosts || []).map((cost, i) =>
            <WrapItem key={producer.costsResources![i].name}>
              <ResourceBadge resource={producer.costsResources![i]} amount={BigNumber.from(cost)} />
            </WrapItem>
          )}
        </Wrap>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"blue"}
          bg={useColorModeValue('gray.300', 'gray.500')}
          _hover={{ bg: useColorModeValue('gray.400', 'gray.400') }}
          onClick={() => upgrade(planet.id)}
          disabled={getBlockNumber() < producer.nextUpgrade!}
        >
          {getBlockNumber() < producer.nextUpgrade! ?
            `Upgradable in ${producer.nextUpgrade! - getBlockNumber()} blocks` :
            "Upgrade"
          }
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResourceProducerCard;
