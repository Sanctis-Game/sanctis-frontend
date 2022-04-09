import { useWallet } from "@binance-chain/bsc-use-wallet";
import { Button, Divider, Stack, Text, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import ResourceBadge from "components/ResourceBadge";
import { BigNumber } from "ethers";
import useResourceProducer from "hooks/useResourceProducer";
import React from "react";

import { Infrastructure, Planet } from "../../../contexts/Sanctis/types";

const ResourceProducerCard: React.FC<{ infrastructure: Infrastructure; planet: Planet }> = ({
  infrastructure,
  planet,
}) => {
  const { getBlockNumber } = useWallet();
  const { producer, upgrade, harvest } = useResourceProducer(infrastructure, planet.id);
  return (
    <Stack spacing={3} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl" shadow={"xl"}>
      <Text fontWeight="bold" fontSize="xl">
        {producer.name}
      </Text>
      <Text fontSize="md">{producer.description}</Text>
      <Text fontWeight="bold" fontSize="md" textAlign="start">
        Level: {producer.level}
      </Text>
      <Text fontWeight="bold" fontSize="md" textAlign="start">
        Pending:
      </Text>
      <Wrap>
        {(producer.productionPerBlock || []).map((prod, i) => (
          <WrapItem key={producer.producedResources![i].name}>
            <ResourceBadge
              resource={producer.producedResources![i]}
              amount={BigNumber.from(prod).mul(Math.max(0, getBlockNumber() - producer.lastHarvest!))}
              size="sm"
            />
          </WrapItem>
        ))}
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
        {getBlockNumber() < producer.lastHarvest!
          ? `Harvestable in ${producer.lastHarvest! - getBlockNumber()} blocks`
          : "Harvest"}
      </Button>
      <Divider />
      <Stack spacing={2} justify={"center"}>
        <Text fontWeight="bold" fontSize="xl" textAlign="start">
          Upgrade costs:
        </Text>
        <Wrap>
          {(producer.nextCosts || []).map((cost, i) => (
            <WrapItem key={producer.costsResources![i].name}>
              <ResourceBadge resource={producer.costsResources![i]} amount={BigNumber.from(cost)} size="sm" />
            </WrapItem>
          ))}
        </Wrap>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"blue"}
          onClick={() => upgrade(planet.id)}
          disabled={getBlockNumber() < producer.nextUpgrade!}
        >
          {getBlockNumber() < producer.nextUpgrade!
            ? `Upgradable in ${producer.nextUpgrade! - getBlockNumber()} blocks`
            : "Upgrade"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResourceProducerCard;
