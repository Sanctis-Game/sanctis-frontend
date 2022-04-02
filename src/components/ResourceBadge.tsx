import React from "react";
import { Flex, Icon, Image, Text, useColorModeValue } from "@chakra-ui/react";

import { BigNumber, ethers } from "ethers";
import { Resource } from "../contexts/Sanctis/types";

const ResourceBadge: React.FC<{ resource: Resource, amount?: BigNumber }> = ({ resource, amount }) => {
  return (
    <Flex w="100%" background={useColorModeValue('gray.100', 'gray.900')} px="1" py="1" rounded="xl" shadow={"lg"} align="center">
      <Image src={resource.icon} stroke={useColorModeValue('black', 'white')} background="black" maxW="40px" maxH="40px" p={2} rounded="full" />
      <Flex ml="1">
        <Text fontWeight="bold" fontSize="lg" mr={2} textAlign="center">
          {amount ? ethers.utils.formatEther(amount) : "???"} {resource.name}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ResourceBadge;
