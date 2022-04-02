import React, { ReactChild, useMemo } from "react";
import { Button, Container, Flex, Link, Text, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi"

import { useParams } from "react-router-dom";
import usePlanet from "hooks/usePlanet";
import CreateInfrastuctureCard from "./CreateInfrastructureCard";
import ResourceProducerCard from "./ResourceProducerCard";
import ReserveCard from "./ReserveCard";
import useChainPicker from "../../hooks/useChainPicker";
import deployedAddresses from "../../constants";

const Planet: React.FC = () => {
  const { chainId } = useChainPicker()
  const { id } = useParams()
  const planet = usePlanet(id)

  const infrastructureCard = useMemo(() => {
    return planet && planet.infrastructures && Object.values(planet.infrastructures).filter((e: any) => e.level !== 0).map(e => {
      let card: ReactChild

      const resourceProducers = [
        deployedAddresses[chainId].ironMines,
        deployedAddresses[chainId].siliconFurnaces,
        deployedAddresses[chainId].heavyWaterPlants,
      ]

      if (resourceProducers.includes(e.address)) {
        card = <ResourceProducerCard planet={planet} infrastructure={e} />
      } else {
        card = <Text>Unknown infrastructure</Text>
      }
      return <WrapItem key={e.name}>{card}</WrapItem>
    })
  }, [chainId, planet])

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
      <Wrap justify={"center"} m={5}>
        {planet?.reserves && planet.reserves.map(e =>
          <WrapItem key={e.resource.name}>
            <ReserveCard reserve={e} />
          </WrapItem>
        )}
      </Wrap>
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
        <Text fontSize="lg" fontWeight="bold">Planet's infrastructures</Text>
        <Wrap justify={"center"} m={2}>
          {infrastructureCard}
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
