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
import React, { useMemo, useState } from "react";
import { BiArrowFromLeft, BiPlanet } from "react-icons/bi";
import { FaSpaceShuttle } from "react-icons/fa";

import { Fleet, Resource } from "../../../contexts/Sanctis/types";
import useFleets from "../../../hooks/useFleets";

const LoadResourceItem: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const { loadResource } = useFleets();
  const choices = useMemo(() => {
    return fleet.fromPlanet?.reserves.filter((e) => e.amount.gt(0) && e.resource.name !== "Energy") || [];
  }, [fleet.fromPlanet]);
  const [choice, setChoice] = useState<Resource | undefined>(choices.length > 0 ? choices[0].resource : undefined);
  const [quantity, setQuantity] = useState<number>();

  console.log(
    fleet.fromPlanet?.reserves,
    fleet.fromPlanet?.reserves.filter((e) => e.amount.gt(0) && e.resource.name !== "Energy")
  );

  return (
    <AccordionItem>
      <AccordionButton justifyContent="center">
        <Text margin="auto" fontSize="lg">
          Load resources
        </Text>
        <BiPlanet /> <BiArrowFromLeft /> <FaSpaceShuttle />
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Stack spacing={2}>
          <Select onChange={(e) => setChoice(JSON.parse(e.target.value))}>
            {choices.map((e) => (
              <option key={e.resource.name} value={JSON.stringify(e)}>
                {e.resource.name}
              </option>
            ))}
          </Select>
          <Input placeholder="Quantity" type="number" onChange={(e) => setQuantity(Number(e.target.value))} />
          <Button
            px={6}
            disabled={!choice}
            onClick={() => loadResource(fleet, choice!, BigNumber.from(quantity).mul(10 ** 18))}
          >
            Load
          </Button>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default LoadResourceItem;
