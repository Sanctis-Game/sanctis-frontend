import React from "react";
import { Box, Button, Container, Heading, Link, Stack, useColorModeValue } from "@chakra-ui/react";

import useCommanders from "../../hooks/useSanctis";

const Commanders: React.FC = () => {
  const { ownedCommanders } = useCommanders();

  console.log(ownedCommanders);

  return (
    <Container maxW={"5xl"}>
      <Stack
        background={useColorModeValue("white", "gray.800")}
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        p="3"
        rounded="xl"
      >
        <Heading>Sanctis</Heading>
        <Box>
          A commander is free to create and you can have as many as you want. However, the game is designed to encourage
          players to have few commanders with a big empire rather than many commanders with smaller empires.
        </Box>
        <Button as={Link} href={"#/commanders"}>
          Choose a commander
        </Button>
      </Stack>
    </Container>
  );
};

export default Commanders;
