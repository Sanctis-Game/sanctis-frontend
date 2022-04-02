import React, { useState } from "react";
import { Button, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import useSanctis from "../../hooks/useSanctis";
import useApproval from "../../hooks/useApproval";
import deployedAddresses from "../../constants";
import useChainPicker from "hooks/useChainPicker";

const ColonizeCard: React.FC<{ colonizer: number }> = ({ colonizer }) => {
  const { chainId } = useChainPicker()
  const { colonizationCost, colonizePlanet } = useSanctis()
  const { allowance, onApprove } = useApproval(deployedAddresses[chainId].credits, deployedAddresses[chainId].planets)
  const [x, setX] = useState<number>()
  const [y, setY] = useState<number>()
  const [z, setZ] = useState<number>()

  return (
    <Stack
      textAlign={"center"}
      align={"center"}
      m={5}
      spacing={{ base: 8, md: 10 }}
    >
      <Stack spacing={6} background={useColorModeValue('white', 'gray.800')} p="5" rounded="xl">
        <Text fontWeight="bold" fontSize="xl">Colonize a planet</Text>
        <Input type="number" placeholder="X coordinate..." onChange={(e) => setX(Number(e.target.value))} />
        <Input type="number" placeholder="Y coordinate..." onChange={(e) => setY(Number(e.target.value))} />
        <Input type="number" placeholder="Z coordinate..." onChange={(e) => setZ(Number(e.target.value))} />
        {allowance && colonizationCost?.lt(allowance) ? (
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            bg={"blue.400"}
            _hover={{ bg: "blue.500" }}
            disabled={x === undefined || y === undefined || z === undefined}
            onClick={() => colonizePlanet(colonizer, x || 0, y || 0, z || 0)}
          >
            Colonize for {colonizationCost ? colonizationCost.div(10 ** 12).toNumber() / 10 ** 6 : "??"} $CREDS
          </Button>
        ) : (
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            bg={"blue.400"}
            _hover={{ bg: "blue.500" }}
            onClick={() => onApprove()}
          >
            Approve
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default ColonizeCard;
