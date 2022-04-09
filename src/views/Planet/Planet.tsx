import { Accordion, Button, Container, Link, useColorModeValue } from "@chakra-ui/react";
import usePlanet from "hooks/usePlanet";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useParams } from "react-router-dom";

import ReservesSection from "./ReservesSection";
import InfrastructuresSection from "./InfrastructuresSection";
import FleetsSection from "./FleetsSection";

const Planet: React.FC = () => {
  const { id } = useParams();
  const planet = usePlanet(id);

  const sections = planet ? (
    <>
      <ReservesSection planet={planet} />
      <InfrastructuresSection planet={planet} />
      <FleetsSection planet={planet} />
    </>
  ) : null;

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
      <Accordion allowMultiple allowToggle>
        {sections}
      </Accordion>
    </Container>
  );
};

export default Planet;
