import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Button, Select, Stack, Text, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";

import { Infrastructure, Planet, Resource } from "../../contexts/Sanctis/types";
import useApprovedObjects from "../../hooks/useApprovedObjects";
import useInfrastructure from "../../hooks/useInfrastructure";
import ResourceBadge from "components/ResourceBadge";

const CreateInfrastuctureCard: React.FC<{ planet: Planet }> = ({ planet }) => {
  const { infrastructures } = useApprovedObjects()
  const choices = useMemo(() => {
    return infrastructures.filter(e => !e.level)
  }, [infrastructures])
  const [choice, setChoice] = useState<Infrastructure>(choices[0] || infrastructures[0])
  const { infrastructure, create } = useInfrastructure(choice, planet.id)

  const handleSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setChoice(JSON.parse(e.target.value))
  }, [setChoice])

  const handleCreate = useCallback(async () => {
    create(planet.id)
  }, [planet, create])

  return (
    <Stack spacing={6} background={useColorModeValue('white', 'gray.800')} p="5" rounded="xl">
      <Text fontSize="xl">Choose an infrastructure to build</Text>
      <Select onChange={handleSelect}>
        {choices.map(e => <option key={e.name} value={JSON.stringify(e)}>{e.name}</option>)}
      </Select>
      {infrastructure && (
        <>
          <Text fontSize="lg">{infrastructure.description}</Text>
          {infrastructure.nextCosts && infrastructure.costsResources ? (
            <Stack spacing={0}>
              <Text>Costs:</Text>
              <Wrap mt={0}>
                {infrastructure.costsResources.map((e: Resource, i) =>
                  <WrapItem key={e.name} mt={0}>
                    <ResourceBadge resource={e} amount={infrastructure.nextCosts![i]}/>
                  </WrapItem>
                )}
              </Wrap>
            </Stack>
          ) : (
            <Text>This infrastructure is free to build</Text>
          )}
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            bg={"blue.400"}
            _hover={{ bg: "blue.500" }}
            onClick={handleCreate}
          >
            Create
          </Button>
        </>
      )}
    </Stack>
  );
};

export default CreateInfrastuctureCard;
