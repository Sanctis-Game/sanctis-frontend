import { Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { formatEther } from 'ethers/lib/utils'
import React from 'react'

import { Reserve } from '../../contexts/Sanctis/types'

const ReserveCard: React.FC<{ reserve: Reserve }> = ({ reserve }) => {
  return (
    <Stack spacing={6} background={useColorModeValue("white", "gray.800")} p="5" rounded="xl" shadow={"xl"}>
      <Text fontWeight="bold" fontSize="xl">
        {reserve.resource.name}
      </Text>
      <Text fontWeight="bold" fontSize="xl">
        {formatEther(reserve.amount)}
      </Text>
    </Stack>
  );
};

export default ReserveCard;
