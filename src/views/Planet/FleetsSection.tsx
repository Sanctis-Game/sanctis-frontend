import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
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
    <AccordionItem w="100%">
      <Flex
        direction={"column"}
        textAlign={"center"}
        align={"center"}
        bg={useColorModeValue("gray.300", "gray.700")}
        m={2}
        p={3}
        rounded="lg"
        shadow="2xl"
        boxShadow="inner"
      >
        <AccordionButton justifyContent="center">
          <DocumentationButton href="https://docs.sanctis.xyz/sections/game/fleets" />
          <Text margin="auto" fontSize="xl" fontWeight="bold" mb="3">
            Planet's fleets
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Stack spacing={4}>
            <Wrap justify={"center"} m={2}>
              {fleets && fleets.length > 0 ? (
                fleets.map((fleet) => <FleetCard key={fleet.id} fleet={fleet} />)
              ) : (
                <Text>There are no fleets on this planet</Text>
              )}
            </Wrap>
            {currentCommander && currentCommander?.id === planet.ruler && (
              <>
                <Divider mt={7} w="100%" />
                <Flex justify={"center"} mt={5}>
                  <Button onClick={() => create(currentCommander, planet.id)}>Create a new fleet</Button>
                </Flex>
              </>
            )}
          </Stack>
        </AccordionPanel>
      </Flex>
    </AccordionItem>
  );
};

export default FleetsSection;
