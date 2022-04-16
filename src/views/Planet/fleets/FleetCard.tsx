import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React from "react";
import ResourceBadge from "../../../components/ResourceBadge";
import ShipStatBadge from "../../../components/ShipStatBadge";

import { Fleet, FleetStatus } from "../../../contexts/Sanctis/types";
import useFleets from "../../../hooks/useFleets";
import useSanctis from "../../../hooks/useSanctis";
import AddToFleetItem from "./AddToFleetItem";
import LoadResourceItem from "./LoadResourceItem";
import RemoveFromFleetItem from "./RemoveFromFleetItem";
import UnloadResourceItem from "./UnloadResourceItem copy";

const FleetCard: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const { currentCommander } = useSanctis();
  const { move, putInOrbit, land } = useFleets();

  return (
    <AccordionItem w="100%">
      <AccordionButton>
        <Flex justify="space-between" w="100%">
          <Box minW="20">
            <Text fontWeight="bold" fontSize="md" textAlign="start" px="1">
              ID: {fleet.id}
            </Text>
          </Box>
          <Box minW="20">
            <Text fontWeight="bold" textAlign="start" px="1">
              {fleet.commander?.toString() === currentCommander?.id ? (
                currentCommander?.name
              ) : (
                <Link href={`#/commander/${fleet.commander?.toString()}`}>{fleet.commander?.toString()}</Link>
              )}
            </Text>
          </Box>
          <Box minW="20">
            <Text fontWeight="bold" textAlign="start" px="1">
              {fleet.status}
            </Text>
          </Box>
          <Flex minW="60" px="1">
            <ShipStatBadge type="speed" amount={fleet.totalSpeed?.toNumber()} />
            <ShipStatBadge type="offense" amount={fleet.totalOffensivePower?.toNumber()} />
            <ShipStatBadge type="defense" amount={fleet.totalDefensivePower?.toNumber()} />
            <ShipStatBadge type="capacity" amount={Number(ethers.utils.formatEther(fleet.capacity || 0))} />
          </Flex>
        </Flex>
      </AccordionButton>
      <AccordionPanel width="100%">
        {Object.values(fleet.resources).filter((e) => e.amount.gt(0)).length > 0 && (
          <Stack>
            <Text textAlign="start">Fleet's resources:</Text>
            <Flex w="100%">
              {fleet.resources
                .filter((e) => e.amount.gt(0))
                .map((e) => (
                  <ResourceBadge resource={e.resource} amount={e.amount} />
                ))}
            </Flex>
          </Stack>
        )}
        {fleet.commander?.toString() === currentCommander?.id && (
          <>
            <Divider />
            <Text fontWeight="bold" fontSize="xl">
              Actions
            </Text>
            <Accordion allowMultiple allowToggle>
              {fleet.status === FleetStatus.Preparing && (
                <>
                  <AddToFleetItem fleet={fleet} />
                  <RemoveFromFleetItem fleet={fleet} />
                  <LoadResourceItem fleet={fleet} />
                  <UnloadResourceItem fleet={fleet} />
                  <AccordionItem>
                    <AccordionButton justifyContent="center">
                      <Text margin="auto" fontSize="lg">
                        Move
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Button rounded={"full"} px={6} colorScheme={"blue"} onClick={() => putInOrbit(fleet)}>
                        Put in orbit
                      </Button>
                    </AccordionPanel>
                  </AccordionItem>
                </>
              )}
              {fleet.status === FleetStatus.Orbitting && (
                <>
                  <LoadResourceItem fleet={fleet} />
                  <UnloadResourceItem fleet={fleet} />
                  <AccordionItem>
                    <AccordionButton justifyContent="center">
                      <Text margin="auto" fontSize="lg">
                        Move
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Button rounded={"full"} px={6} colorScheme={"blue"} onClick={() => land(fleet)}>
                        Land
                      </Button>
                      <Stack p={3} border="solid" rounded="xl">
                        <Text>Send the fleet to another planet</Text>
                        <HStack spacing={1} justify="center">
                          <Input placeholder="X..." maxW={20} />
                          <Input placeholder="Y..." maxW={20} />
                          <Input placeholder="Z..." maxW={20} />
                        </HStack>
                        <Button
                          rounded={"full"}
                          px={6}
                          colorScheme={"blue"}
                          onClick={() => move(fleet, fleet.toPlanet!)}
                        >
                          Move
                        </Button>
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                </>
              )}
            </Accordion>
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default FleetCard;
