import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useToast } from '@chakra-ui/react'
import { ExternalProvider } from '@ethersproject/providers'
import { BigNumber, Contract, ethers, providers, utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ResourceProducerABI from '../constants/contracts/IResourceProducer.sol/IResourceProducer.json'
import { Infrastructure, Resource } from '../contexts/Sanctis/types'
import useApprovedObjects from './useApprovedObjects'
import useConfirmationModal from './useConfirmationModal'
import useInfrastructure from './useInfrastructure'
import useSanctis from './useSanctis'

export interface ResourceProducerCharacteristics extends Infrastructure {
  lastHarvest?: number;
  producedResources?: Resource[];
  productionPerBlock?: BigNumber[];
  nextProduction?: BigNumber[];
}

const useResourceProducer = (infrastructure: Infrastructure, planetId: string) => {
  const toast = useToast();
  const { open } = useConfirmationModal();
  const { ethereum } = useWallet<ExternalProvider>();
  const { resources } = useApprovedObjects();
  const { fetchPlanet } = useSanctis();
  const { infrastructure: baseInfra, create, upgrade } = useInfrastructure(infrastructure, planetId);
  const [loadedProducer, setLoadedProducer] = useState<ResourceProducerCharacteristics>(infrastructure);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const contract = useMemo(() => {
    if (!ethereum) return;
    const ResourceProducerInterface = new utils.Interface(ResourceProducerABI.abi);
    return new Contract(
      infrastructure.address,
      ResourceProducerInterface,
      new providers.Web3Provider(ethereum).getSigner()
    );
  }, [ethereum, infrastructure]);

  const fetch = useCallback(async () => {
    if (!contract || isFetching) return;
    setIsFetching(true);

    try {
      const lastHarvest = await contract.lastHarvest(planetId);
      const [producedResources, currentProduction] = await contract.currentProduction(planetId);
      const [, nextProduction] = await contract.nextProduction(planetId);
      setLoadedProducer({
        ...baseInfra,
        lastHarvest: lastHarvest.toNumber(),
        producedResources: producedResources.map((e: string) =>
          resources.find((a) => ethers.utils.getAddress(e) === ethers.utils.getAddress(a.address))
        ),
        productionPerBlock: currentProduction.map((e: any) => BigNumber.from(e)),
        nextProduction: nextProduction,
      });
    } catch (err: any) {
      console.log("Failed fetching resource producer", err);
    }
    setIsFetching(false);
  }, [contract, isFetching, baseInfra, planetId, resources, setLoadedProducer]);

  useEffect(() => {
    if (!loadedProducer.costsResources || !loadedProducer.nextCosts) fetch();
  }, [loadedProducer, fetch]);

  const harvest = useCallback(
    async (planetId: string) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.harvest(planetId);
          await result.wait();
          await fetch();
          await fetchPlanet(planetId);
          toast({
            status: "success",
            title: "Harvest",
            description: `An ${infrastructure.name} has been harvested on Planet ${planetId}`,
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
    [contract, infrastructure, fetch, fetchPlanet, open, toast]
  );

  return {
    producer: loadedProducer,
    fetch,
    create,
    upgrade,
    harvest,
  };
};

export default useResourceProducer;
