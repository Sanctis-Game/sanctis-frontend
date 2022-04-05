import { Button, Container, Flex, Link, Text, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react'
import usePlanet from 'hooks/usePlanet'
import React, { ReactChild, useMemo } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useParams } from 'react-router-dom'

import ResourceBadge from '../../components/ResourceBadge'
import deployedAddresses from '../../constants'
import useChainPicker from '../../hooks/useChainPicker'
import CreateInfrastuctureCard from './CreateInfrastructureCard'
import PowerPlantCard from './PowerPlantCard'
import ResourceProducerCard from './ResourceProducerCard'
import SpatioportCard from './SpatioportCard'

const Planet: React.FC = () => {
  const { chainId } = useChainPicker();
  const { id } = useParams();
  const planet = usePlanet(id);

  const infrastructureCards = useMemo(() => {
    return (
      planet &&
      planet.infrastructures &&
      Object.values(planet.infrastructures)
        .filter((e: any) => e.level !== 0)
        .map((e) => {
          let card: ReactChild;

          const resourceProducers = [
            deployedAddresses[chainId].ironMines,
            deployedAddresses[chainId].siliconFurnaces,
            deployedAddresses[chainId].heavyWaterPlants,
          ];
          const powerPlants = [deployedAddresses[chainId].solarPanels, deployedAddresses[chainId].fusionReactors];

          if (resourceProducers.includes(e.address)) {
            card = <ResourceProducerCard planet={planet} infrastructure={e} />;
          } else if (powerPlants.includes(e.address)) {
            card = <PowerPlantCard planet={planet} infrastructure={e} />;
          } else if (e.address === deployedAddresses[chainId].spatioports) {
            card = <SpatioportCard planet={planet} infrastructure={e} />;
          } else {
            card = <Text>Unknown infrastructure</Text>;
          }
          return <WrapItem key={e.name}>{card}</WrapItem>;
        })
    );
  }, [chainId, planet]);

  return (
    <Container maxW={"5xl"}>
      <Button
        rightIcon={<BiArrowBack />}
        as={Link}
        href={planet ? `#/commander/` + planet?.ruler : "#/commanders"}
        bg={useColorModeValue("gray.300", "gray.700")}
        mb={3}
      >
        Back
      </Button>
      <Flex
        direction="column"
        align={"center"}
        m={2}
        p={3}
        background={useColorModeValue("gray.300", "gray.700")}
        rounded="lg"
      >
        <Text mb="3" fontSize="xl" fontWeight="bold">
          Planet's reserves
        </Text>
        <Wrap>
          {planet?.reserves &&
            planet.reserves.map((e) => (
              <WrapItem key={e.resource.name}>
                <ResourceBadge resource={e.resource} amount={e.amount} size="lg" />
              </WrapItem>
            ))}
        </Wrap>
      </Flex>
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
        <Text fontSize="xl" fontWeight="bold" mb="3">
          Planet's infrastructures
        </Text>
        <Wrap justify={"center"} m={2}>
          {infrastructureCards}
        </Wrap>
      </Flex>
      {planet && (
        <Flex justify={"center"} m={5}>
          <CreateInfrastuctureCard planet={planet} />
        </Flex>
      )}
    </Container>
  );
};

export default Planet;
