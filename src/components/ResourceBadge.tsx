import { Flex, Image, Text, useColorModeValue } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import React from 'react'

import { Resource } from '../contexts/Sanctis/types'

const ResourceBadge: React.FC<{ resource: Resource; amount?: BigNumber; size?: "sm" | "md" | "lg" }> = ({
  resource,
  amount,
  size = "md",
}) => {
  const iconSize = ((size: string) => {
    switch (size) {
      case "sm":
        return "30px";
      case "md":
        return "40px";
      case "lg":
        return "50px";
      default:
        return "40px";
    }
  })(size);
  return (
    <Flex
      w="100%"
      background={useColorModeValue("gray.400", "gray.600")}
      p="1.5"
      rounded="3xl"
      shadow={size}
      align="center"
    >
      <Image
        src={resource.icon}
        stroke={useColorModeValue("black", "white")}
        background="black"
        maxW={iconSize}
        maxH={iconSize}
        p={2}
        rounded="full"
      />
      <Flex ml="1">
        <Text fontWeight="bold" fontSize={size} mr={2} textAlign="center">
          {amount ? ethers.utils.formatEther(amount) : "???"} {resource.name}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ResourceBadge;
