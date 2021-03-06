import { Box, Container, Stack, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";

import useCommanders from "../../hooks/useSanctis";
import CommanderCard from "./CommanderCard";
import CreateCommanderCard from "./CreateCommanderCard";

const Commanders: React.FC = () => {
  const { ownedCommanders } = useCommanders();

  return (
    <Container maxW={"5xl"}>
      <Stack textAlign={"center"} align={"center"} spacing={{ base: 8, md: 10 }}>
        {ownedCommanders && ownedCommanders.length > 0 && (
          <Wrap>
            {ownedCommanders.map((commander, i) => (
              <WrapItem key={`${commander.id}-${i}`}>
                <CommanderCard commander={commander} />
              </WrapItem>
            ))}
          </Wrap>
        )}
        <Box background={useColorModeValue("white", "gray.800")} p="3" rounded="xl">
          A commander is free to create and you can have as many as you want. However, the game is designed to encourage
          players to have few commanders with a big empire rather than many commanders with smaller empires.
        </Box>
        <CreateCommanderCard />
      </Stack>
    </Container>
  );
};

export default Commanders;
