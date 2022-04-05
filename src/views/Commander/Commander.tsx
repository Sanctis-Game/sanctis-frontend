import { Button, Container, Flex, Link, Text, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react'
import useCommander from 'hooks/useCommander'
import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useParams } from 'react-router-dom'

import ColonizeCard from './ColonizeCard'
import PlanetCard from './PlanetCard'

const Commander: React.FC = () => {
  const { id } = useParams();
  const commander = useCommander(Number(id));

  return (
    <Container maxW={"5xl"}>
      <Button rightIcon={<BiArrowBack />} as={Link} href={"#/commanders"}>
        Back
      </Button>
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
        <Text fontSize="lg" fontWeight="bold">
          {commander?.name}'s planets
        </Text>
        <Wrap spacing={5} mt="2">
          {commander?.planets?.map((e) => (
            <WrapItem key={e} shadow="xl">
              <PlanetCard planetId={e} />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
      {commander && <ColonizeCard colonizer={commander?.id} />}
    </Container>
  );
};

export default Commander;
