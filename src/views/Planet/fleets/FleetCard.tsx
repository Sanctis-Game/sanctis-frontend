import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
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
    <Stack spacing={3} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl" shadow={"xl"} minW={80}>
      <Text fontWeight="bold" fontSize="md" textAlign="start">
        Fleet ID: {fleet.id}
      </Text>
      <Text textAlign="start">Controller: {fleet.commander.toString()}</Text>
      <Text textAlign="start">Status: {fleet.status}</Text>
      <Text textAlign="start">Fleet's statistics:</Text>
      <Flex w="100%">
        <ShipStatBadge type="speed" amount={fleet.totalSpeed.toNumber()} />
        <ShipStatBadge type="offense" amount={fleet.totalOffensivePower.toNumber()} />
        <ShipStatBadge type="defense" amount={fleet.totalDefensivePower.toNumber()} />
        <ShipStatBadge type="capacity" amount={Number(ethers.utils.formatEther(fleet.capacity || 0))} />
      </Flex>
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
      {fleet.commander.toString() === currentCommander?.id && (
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
                      <Button rounded={"full"} px={6} colorScheme={"blue"} onClick={() => move(fleet, fleet.toPlanet!)}>
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
    </Stack>
  );
};

export default FleetCard;
