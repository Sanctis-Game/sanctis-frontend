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
import { BigNumber } from "ethers";
import React, { useState } from "react";
import { BiArrowFromLeft, BiPlanet } from "react-icons/bi";
import { FaSpaceShuttle } from "react-icons/fa";

import { Fleet, Resource } from "../../contexts/Sanctis/types";
import useFleets from "../../hooks/useFleets";

const UnloadResourceItem: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const { unloadResource } = useFleets();
  const [choice, setChoice] = useState<Resource>();
  const [quantity, setQuantity] = useState<number>();

  return (
    <AccordionItem>
      <AccordionButton justifyContent="center">
        <Text margin="auto" fontSize="lg">
          Unload resources
        </Text>
        <FaSpaceShuttle /> <BiArrowFromLeft /> <BiPlanet />
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Stack spacing={2}>
          <Select onChange={(e) => setChoice(JSON.parse(e.target.value))}>
            {fleet.resources
              .filter((e) => e.amount.gt(0))
              .map((e) => (
                <option key={e.resource.name} value={JSON.stringify(e)}>
                  {e.resource.name}
                </option>
              ))}
          </Select>
          <Input placeholder="Quantity" type="number" onChange={(e) => setQuantity(Number(e.target.value))} />
          <Button
            disabled={!choice}
            onClick={() => unloadResource(fleet, choice!, BigNumber.from(quantity).mul(10 ** 18))}
          >
            Unload
          </Button>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default UnloadResourceItem;
