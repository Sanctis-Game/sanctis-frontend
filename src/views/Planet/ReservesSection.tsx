import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";

import ResourceBadge from "../../components/ResourceBadge";
import { Planet } from "../../contexts/Sanctis/types";

const ReservesSection: React.FC<{ planet: Planet }> = ({ planet }) => {
  return (
    <AccordionItem>
      <Flex
        direction="column"
        align={"center"}
        m={2}
        p={3}
        background={useColorModeValue("gray.300", "gray.700")}
        rounded="lg"
      >
        <AccordionButton justifyContent="center">
          <Text margin="auto" mb="3" fontSize="xl" fontWeight="bold">
            Planet's reserves
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Wrap>
            {planet.reserves.map((e) => (
              <WrapItem key={e.resource.name + e.amount.toString()}>
                <ResourceBadge resource={e.resource} amount={e.amount} size="lg" />
              </WrapItem>
            ))}
          </Wrap>
        </AccordionPanel>
      </Flex>
    </AccordionItem>
  );
};

export default ReservesSection;
