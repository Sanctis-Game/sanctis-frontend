import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useToast } from '@chakra-ui/react'
import { ExternalProvider } from '@ethersproject/providers'
import { Contract, providers, utils } from 'ethers'
import { useCallback, useMemo, useState } from 'react'

import SpatioportABI from '../constants/contracts/ISpatioports.sol/ISpatioports.json'
import { Infrastructure, Ship } from '../contexts/Sanctis/types'
import useConfirmationModal from './useConfirmationModal'
import useInfrastructure from './useInfrastructure'

export interface SpatioportCharacteristics extends Infrastructure {
  nextUpgrade?: number;
  discount?: number;
}

const useSpatioport = (infrastructure: Infrastructure, planetId: string) => {
  const toast = useToast();
  const { open } = useConfirmationModal();
  const { ethereum } = useWallet<ExternalProvider>();
  const { infrastructure: loadedInfrastructure, create, upgrade } = useInfrastructure(infrastructure, planetId);
  const [spatioport, setSpatioport] = useState<SpatioportCharacteristics>(infrastructure);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const contract = useMemo(() => {
    if (!ethereum) return;
    const SpatioportInterface = new utils.Interface(SpatioportABI.abi);
    return new Contract(infrastructure.address, SpatioportInterface, new providers.Web3Provider(ethereum).getSigner());
  }, [ethereum, infrastructure]);

  const fetch = useCallback(async () => {
    if (!contract || isFetching) return;
    setIsFetching(true);

    try {
      const characteristics = await contract.spatioport(planetId);
      setSpatioport({
        ...loadedInfrastructure,
        level: characteristics.level.toNumber(),
        nextUpgrade: characteristics.nextUpgrade.toNumber(),
      });
    } catch (err: any) {
      console.log("Failed fetching resource producer", err);
    }
    setIsFetching(false);
  }, [contract, isFetching, loadedInfrastructure, planetId, setSpatioport]);

  const build: (planetId: string, ship: Ship, quantity: number) => Promise<void> = useCallback(
    async (planetId, ship, quantity) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.build(planetId, ship.address, quantity);
          await result.wait();
          toast({
            status: "success",
            title: "Build",
            description: `${quantity} ${ship.name} have been built on Planet ${planetId}`,
          });
        } catch (err: any) {
          toast({
            status: "error",
            title: "Error",
            description: `Failed harvest: ${err.data?.message || err.message}`,
          });
        }
      });
    },
    [contract, open, toast]
  );

  return {
    spatioport,
    fetch,
    create,
    upgrade,
    build,
  };
};

export default useSpatioport;
