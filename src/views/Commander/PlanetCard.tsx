import { Button, Link, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import usePlanet from 'hooks/usePlanet'
import React from 'react'

const PlanetCard: React.FC<{ planetId: string }> = ({ planetId }) => {
  const planet = usePlanet(planetId);
  return (
    <Stack spacing={6} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl">
      {planet ? (
        <>
          <Text fontWeight="bold" fontSize="xl">{`Coordinate: (X=${planet.x}; Y=${planet.y}; Z=${planet.z})`}</Text>
          <Text fontWeight="bold" fontSize="xl">
            Humidity: {planet.humidity}
          </Text>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            bg={"blue.400"}
            _hover={{ bg: "blue.500" }}
            as={Link}
            href={`#/planet/${planet.id}`}
          >
            Details
          </Button>
        </>
      ) : (
        <Spinner />
      )}
    </Stack>
  );
};

export default PlanetCard;
