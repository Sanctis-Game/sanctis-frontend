import { Box, Flex, Image, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import numeral from "numeral";
import React, { useMemo } from "react";

import { Resource } from "../contexts/Sanctis/types";

const ResourceBadge: React.FC<{ resource: Resource; amount?: BigNumber; size?: "sm" | "md" | "lg" }> = ({
  resource,
  amount,
  size = "md",
}) => {
  const bgColor = useColorModeValue("gray.400", "gray.600");
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
  const width = useMemo(() => {
    switch (size) {
      case "sm":
        return "3em";
      case "md":
        return "2em";
      case "lg":
        return "2em";
    }
  }, [size]);
  const content = useMemo(() => {
    return (
      <Flex
        background={bgColor}
        p="2"
        rounded="3xl"
        w="calc(120%)"
        shadow={size}
        align="center"
        direction={size !== "sm" ? "column" : "row"}
      >
        <Image src={resource.icon} background="black" maxW={iconSize} maxH={iconSize} p={2} rounded="full" />
        <Box ml="1" minW={width} justifyContent={size !== "sm" ? "center" : "start"}>
          <Text fontWeight="bold" fontSize={size} width="fit-content">
            {amount ? numeral(ethers.utils.formatEther(amount)).format("0.0a") : "???"}
          </Text>
          {size !== "sm" && (
            <Text fontSize={size} width="fit-content">
              {resource.name}
            </Text>
          )}
        </Box>
      </Flex>
    );
  }, [amount, iconSize, resource, bgColor, size, width]);

  return size !== "sm" ? content : <Tooltip label={resource.name}>{content}</Tooltip>;
};

export default ResourceBadge;
