import { Flex, Image, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'

import capacity from '../assets/chest.svg'
import offense from '../assets/gladius.svg'
import defense from '../assets/shield.svg'
import speed from '../assets/speedometer.svg'

const ShipStatBadge: React.FC<{
  type: "offense" | "defense" | "capacity" | "speed";
  amount?: number;
}> = ({ type, amount }) => {
  const name = useMemo(() => {
    switch (type) {
      case "speed":
        return "Speed";
      case "offense":
        return "Attack";
      case "defense":
        return "Defense";
      case "capacity":
        return "Capacity";
    }
  }, [type]);

  const icon = useMemo(() => {
    switch (type) {
      case "speed":
        return speed;
      case "offense":
        return offense;
      case "defense":
        return defense;
      case "capacity":
        return capacity;
      default:
        return defense;
    }
  }, [type]);

  return (
    <Tooltip label={name}>
      <Flex
        w="100%"
        background={useColorModeValue("gray.400", "gray.600")}
        p="1.5"
        rounded="3xl"
        shadow={"sm"}
        align="center"
      >
        <Image
          src={icon}
          stroke={useColorModeValue("black", "white")}
          background="black"
          maxW={"30px"}
          maxH={"30px"}
          p={2}
          rounded="full"
        />
        <Flex ml="1">
          <Text fontWeight="bold" fontSize={"sm"} mr={2} textAlign="center" width={"fit-content"}>
            {amount ? amount : "0"}
          </Text>
        </Flex>
      </Flex>
    </Tooltip>
  );
};

export default ShipStatBadge;
