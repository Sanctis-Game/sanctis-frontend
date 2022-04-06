import React from "react";
import {
  Box,
  Button,
  Container,
  Link,
  List,
  ListItem,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import useCommander from "hooks/useCommander";
import { planetIdToCoordinate } from "utils";

const CommanderCard: React.FC<{ id: number }> = ({ id }) => {
  const commander = useCommander(id);

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
            {commander.onboarding && (
              <Text fontWeight="bold" fontSize="xl">
                Citizen of the Sanctis
              </Text>
            )}
            <Box textAlign={"start"}>
              <Text fontSize="xl">Planets:</Text>
              {!commander.planets || commander.planets.length === 0 ? (
                <Text>This commander has no planet</Text>
              ) : (
                <List>
                  {commander.planets.map((planet) => (
                    <ListItem key={planet}>
                      <Link href={`/planet/${planet}`}>{planetIdToCoordinate(planet)}</Link>
                    </ListItem>
                  ))}
                </List>
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
            >
              Details
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
