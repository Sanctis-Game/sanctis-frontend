import { Button, Divider, Flex, HStack, Input, Select, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";
import ResourceBadge from "../../../components/ResourceBadge";
import ShipStatBadge from "../../../components/ShipStatBadge";

import { Fleet, FleetStatus, Ship } from "../../../contexts/Sanctis/types";
import useApprovedObjects from "../../../hooks/useApprovedObjects";
import useFleets from "../../../hooks/useFleets";
import useSanctis from "../../../hooks/useSanctis";
import useShip from "../../../hooks/useShip";

const FleetCard: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const { ships } = useApprovedObjects();
  const { currentCommander } = useSanctis();
  const { ships: approvedShips, resources } = useApprovedObjects();
  const { move, addToFleet, removeFromFleet, putInOrbit, land } = useFleets();
  const [choice, setChoice] = useState<Ship>(ships[0]);
  const [removeChoice, setRemoveChoice] = useState<Ship>(ships[0]);
  const [quantity, setQuantity] = useState<number>();
  const [removeQuantity, setRemoveQuantity] = useState<number>();
  const { ship } = useShip(choice, fleet.fromPlanet);

  console.log(ship, fleet);

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
      {Object.values(fleet.resources).filter((e) => e.gt(0)).length > 0 && (
        <Stack>
          <Text textAlign="start">Fleet's resources:</Text>
          <Flex w="100%">
            {Object.entries(fleet.resources)
              .filter(([, amount]) => amount.gt(0))
              .map(([address, amount]) => (
                <ResourceBadge resource={resources.find((e) => e.address === address)!} amount={amount} />
              ))}
          </Flex>
        </Stack>
      )}
      {fleet.commander.toString() === currentCommander?.id && (
        <>
          <Divider />
          <Stack spacing={2} justify={"center"}>
            {fleet.status === FleetStatus.Preparing && (
              <>
                <Stack spacing={1} rounded="xl" p="2" border="solid">
                  <Text>Add ships to the fleet</Text>
                  <Select onChange={(e) => setChoice(JSON.parse(e.target.value))}>
                    {ships
                      .filter((e) => (e.reserve || 0) > 0)
                      .map((ship) => (
                        <option key={ship.name} value={JSON.stringify(ship)}>
                          {ship.name}
                        </option>
                      ))}
                  </Select>
                  <Input
                    type="number"
                    max={ship.reserve}
                    value={quantity || 0}
                    onChange={(e) => setQuantity(Math.min(Number(e.target.value), ship.reserve || 0))}
                  />
                  <Button disabled={!quantity} onClick={() => addToFleet(fleet, choice, quantity!)}>
                    Add to fleet
                  </Button>
                </Stack>
                <Stack spacing={1} rounded="xl" p="2" border="solid">
                  <Text>Remove ships from the fleet</Text>
                  <Select onChange={(e) => setRemoveChoice(JSON.parse(e.target.value))}>
                    {approvedShips
                      .filter((e) => fleet.shipsInFleet[e.address] > 0)
                      .map((ship) => (
                        <option key={ship.name} value={JSON.stringify(ship)}>
                          {ship.name}
                        </option>
                      ))}
                  </Select>
                  <Input
                    type="number"
                    max={ship.reserve}
                    value={removeQuantity || 0}
                    onChange={(e) =>
                      setRemoveQuantity(Math.min(Number(e.target.value), fleet.shipsInFleet[removeChoice.address] || 0))
                    }
                  />
                  <Button disabled={!removeQuantity} onClick={() => removeFromFleet(fleet, removeChoice, quantity!)}>
                    Remove from fleet
                  </Button>
                </Stack>
                <Button rounded={"full"} px={6} colorScheme={"blue"} onClick={() => putInOrbit(fleet)}>
                  Put in orbit
                </Button>
              </>
            )}
            {fleet.status === FleetStatus.Orbitting && (
              <>
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
              </>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default FleetCard;
