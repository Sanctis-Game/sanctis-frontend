import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { ReactChild, useMemo } from "react";

import deployedAddresses from "../../constants";
import DocumentationButton from "../../contexts/DocumentationButton";
import { Planet } from "../../contexts/Sanctis/types";
import useChainPicker from "../../hooks/useChainPicker";
import CreateInfrastuctureCard from "./infrastructures/CreateInfrastructureCard";
import PowerPlantCard from "./infrastructures/PowerPlantCard";
import ResourceProducerCard from "./infrastructures/ResourceProducerCard";
import SpatioportCard from "./infrastructures/SpatioportCard";

const InfrastructuresSection: React.FC<{ planet: Planet }> = ({ planet }) => {
  const { chainId } = useChainPicker();

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
    <AccordionItem>
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
        <AccordionButton justifyContent="center">
          <DocumentationButton href="https://docs.sanctis.xyz/sections/game/infrastructures" />
          <Text margin="auto" fontSize="xl" fontWeight="bold" mb="3">
            Planet's infrastructures
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Wrap justify={"center"} m={2}>
            {infrastructureCards}
          </Wrap>
          <Divider mt={7} />
          <Flex justify={"center"} m={5}>
            <CreateInfrastuctureCard planet={planet} />
          </Flex>
        </AccordionPanel>
      </Flex>
    </AccordionItem>
  );
};

export default InfrastructuresSection;
