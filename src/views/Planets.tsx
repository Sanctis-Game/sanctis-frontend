import { Button, Container, Flex, Heading, Stack, Text, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import useSanctis from "../hooks/useSanctis";

import ColonizeCard from "./Commander/ColonizeCard";
import PlanetCard from "./Commander/PlanetCard";

const Planets: React.FC = () => {
  const { currentCommander } = useSanctis();

  return (
    <Container maxW={"5xl"}>
      <Flex
        direction={"column"}
        textAlign={"center"}
        align={"center"}
        bg={useColorModeValue("gray.300", "gray.700")}
        mt={2}
        p={3}
        rounded="lg"
        shadow="2xl"
        boxShadow="inner"
      >
        {currentCommander ? (
          <>
            <Text fontSize="lg" fontWeight="bold">
              {currentCommander?.name}'s planets
            </Text>
            <Wrap spacing={5} mt="2">
              {currentCommander?.planets?.map((e) => (
                <WrapItem key={e} shadow="xl">
                  <PlanetCard planetId={e} />
                </WrapItem>
              ))}
            </Wrap>
          </>
        ) : (
          <Stack spacing={6} p={3}>
            <Heading>You have not chosen a commander</Heading>
            <Button>Choose a summoner</Button>
          </Stack>
        )}
      </Flex>
      {currentCommander && <ColonizeCard colonizer={currentCommander} />}
    </Container>
  );
};

export default Planets;
