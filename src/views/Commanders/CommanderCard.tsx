import React from "react";
import {
  Box,
  Button,
  Container,
  Link,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { planetIdToCoordinate } from "utils";
import useSanctis from "../../hooks/useSanctis";
import { Commander } from "../../contexts/Sanctis/types";
import { BiPlanet } from "react-icons/bi";

const CommanderCard: React.FC<{ commander: Commander }> = ({ commander }) => {
  const { currentCommander, setCurrentCommander } = useSanctis();

  return (
    <Container maxW={"5xl"}>
      <Stack spacing={6} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl">
        {commander ? (
          <Box alignContent={"flex-start"}>
            <Text fontWeight="bold" fontSize="2xl">
              {commander.name}
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {commander.race?.name}
            </Text>
            <Box textAlign={"start"}>
              {!commander.planets || commander.planets.length === 0 ? (
                <Text my="3">This commander has no planet</Text>
              ) : (
                <>
                  <Text fontSize="xl">Planets:</Text>
                  <List>
                    {commander.planets.map((planet, i) => (
                      <ListItem key={planet + i}>
                        <ListIcon as={BiPlanet} fontSize="2xl" />
                        <Link href={`/planet/${planet}`}>{planetIdToCoordinate(planet)}</Link>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
            <Button
              rounded={"full"}
              m={4}
              px={6}
              colorScheme={"blue"}
              bg={"blue.400"}
              _hover={{ bg: "blue.500" }}
              as={Link}
              href={`#/commander/${commander.id}`}
              onClick={() => setCurrentCommander(commander)}
            >
              {currentCommander?.name !== commander.name
                ? `Play as ${commander.name}`
                : `Already playing ${commander.name}`}
            </Button>
          </Box>
        ) : (
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        )}
      </Stack>
    </Container>
  );
};

export default CommanderCard;
