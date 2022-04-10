import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { Fleet, Ship } from "../../../contexts/Sanctis/types";
import useApprovedObjects from "../../../hooks/useApprovedObjects";
import useFleets from "../../../hooks/useFleets";
import useShip from "../../../hooks/useShip";

const RemoveFromFleetItem: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const { ships } = useApprovedObjects();
  const { ships: approvedShips } = useApprovedObjects();
  const { removeFromFleet } = useFleets();
  const [choice, setChoice] = useState<Ship>(ships[0]);
  const [quantity, setQuantity] = useState<number>();
  const { ship } = useShip(choice, fleet.fromPlanet);

  return (
    <AccordionItem>
      <AccordionButton justifyContent="center">
        <Text margin="auto" fontSize="lg">
          Remove ships from the fleet
        </Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Stack spacing={1}>
          <Select onChange={(e) => setChoice(JSON.parse(e.target.value))}>
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
            value={quantity || 0}
            onChange={(e) => setQuantity(Math.min(Number(e.target.value), fleet.shipsInFleet[choice.address] || 0))}
          />
          <Button disabled={!quantity} onClick={() => removeFromFleet(fleet, choice, quantity!)}>
            Remove from fleet
          </Button>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default RemoveFromFleetItem;
