import { Accordion, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Fleet } from "../../contexts/Sanctis/types";
import FleetCard from "./FleetCard";

const FleetsList: React.FC<{ fleets: Fleet[] }> = ({ fleets }) => {
  return (
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
  );
};

export default FleetsList;
