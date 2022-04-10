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

const AddToFleetItem: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const { ships } = useApprovedObjects();
  const { addToFleet } = useFleets();
  const [choice, setChoice] = useState<Ship>(ships[0]);
  const [quantity, setQuantity] = useState<number>();
  const { ship } = useShip(choice, fleet.fromPlanet);

  return (
    <AccordionItem>
      <AccordionButton justifyContent="center">
        <Text margin="auto" fontSize="lg">
          Add ships to the fleet
        </Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Stack spacing={1}>
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
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AddToFleetItem;
