import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import FleetsList from "../../components/FleetsList";
import DocumentationButton from "../../contexts/DocumentationButton";
import { Planet } from "../../contexts/Sanctis/types";

import useFleets from "../../hooks/useFleets";
import useSanctis from "../../hooks/useSanctis";

const FleetsSection: React.FC<{ planet: Planet }> = ({ planet }) => {
  const { currentCommander } = useSanctis();
  const { fleets, create } = useFleets({ planet });
  console.log(planet, currentCommander, fleets);

  return (
    <AccordionItem w="100%" bg={useColorModeValue("gray.300", "gray.700")} rounded="lg">
      <Flex textAlign={"center"} align={"center"} rounded="lg">
        <DocumentationButton href="https://docs.sanctis.xyz/sections/game/fleets" />
        <AccordionButton justifyContent="center" w="100%">
          <Text margin="auto" fontSize="xl" fontWeight="bold" mb="3">
            Planet's fleets
          </Text>
          <AccordionIcon />
        </AccordionButton>
      </Flex>
      <AccordionPanel w="100%">
        {fleets && <FleetsList fleets={fleets} />}

        {currentCommander && currentCommander?.id === planet.ruler && (
          <>
            <Divider mt={7} w="100%" />
            <Flex justify={"center"} mt={5}>
              <Button onClick={() => create(currentCommander, planet.id)}>Create a new fleet</Button>
            </Flex>
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default FleetsSection;
