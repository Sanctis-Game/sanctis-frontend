import React, { ChangeEvent, useCallback, useState } from "react";
import { Button, Input, Select, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { Race } from "../../contexts/Sanctis/types";
import useCommanders from "../../hooks/useSanctis";
import useApprovedObjects from "hooks/useApprovedObjects";

const CreateCommanderCard: React.FC = () => {
  const { races } = useApprovedObjects()
  const { createCommander } = useCommanders()
  const [name, setName] = useState<string>()
  const [race, setRace] = useState<Race>(races[0])

  const handleSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRace(JSON.parse(e.target.value))
  }, [setRace])

  const handleName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [setName])

  const handleCreate = useCallback(async () => {
    if (!race || !name) return

    await createCommander(name, race)
  }, [race, name, createCommander])

  return (
    <Stack spacing={6} background={useColorModeValue('white', 'gray.800')} p="5" rounded="xl">
      <Text fontWeight="bold" fontSize="xl">Create a Commander</Text>
      <Input placeholder="Commander's name" onChange={handleName} />
      <Select onChange={handleSelect}>
        {races.map((race) => <option key={race.name} value={JSON.stringify(race)}>{race.name}</option>)}
      </Select>
      <Button
        rounded={"full"}
        px={6}
        colorScheme={"blue"}
        bg={"blue.400"}
        _hover={{ bg: "blue.500" }}
        disabled={!name || !!name.match(/[^A-Za-z0-9 ]/) }
        onClick={handleCreate}
      >
        Create commander
      </Button>
    </Stack>
  );
};

export default CreateCommanderCard;
