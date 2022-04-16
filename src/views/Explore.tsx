import { Container, Text } from "@chakra-ui/react";
import React from "react";
import usePlanets from "../hooks/usePlanets";

const Explore: React.FC = () => {
  const planets = usePlanets();
  console.log(planets);

  return (
    <Container maxW={"5xl"}>
      <Text fontSize={"3xl"}>This section is under construction</Text>
    </Container>
  );
};

export default Explore;
