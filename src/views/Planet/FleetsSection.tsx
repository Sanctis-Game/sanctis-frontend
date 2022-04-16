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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import DocumentationButton from "../../contexts/DocumentationButton";
import { Planet } from "../../contexts/Sanctis/types";

import useFleets from "../../hooks/useFleets";
import useSanctis from "../../hooks/useSanctis";
import FleetCard from "./fleets/FleetCard";

const FleetsSection: React.FC<{ planet: Planet }> = ({ planet }) => {
  const { currentCommander } = useSanctis();
  const { fleets, create } = useFleets(planet?.id);

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
        <Accordion
          w="100%"
          background={useColorModeValue("white", "gray.800")}
          p="2"
          rounded="xl"
          shadow={"xl"}
          allowMultiple
          allowToggle
        >
          <Flex justify="space-between" p="5">
            <Box fontWeight="bold">ID</Box> <Box fontWeight="bold">Commander</Box> <Box fontWeight="bold">Status</Box>{" "}
            <Box fontWeight="bold">Chracteristics</Box>
          </Flex>
          {fleets && fleets.length > 0 ? (
            fleets.map((fleet) => <FleetCard key={fleet.id} fleet={fleet} />)
          ) : (
            <Text>There are no fleets on this planet</Text>
          )}
        </Accordion>

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
