import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useToast } from '@chakra-ui/react'
import { ExternalProvider } from '@ethersproject/providers'
import { Contract, ethers, providers, utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ResourceProducerABI from '../constants/contracts/IResourceProducer.sol/IResourceProducer.json'
import { Infrastructure } from '../contexts/Sanctis/types'
import useApprovedObjects from './useApprovedObjects'
import useConfirmationModal from './useConfirmationModal'
import useSanctis from './useSanctis'

const useInfrastructure = (infrastructure: Infrastructure, planetId: string) => {
  const toast = useToast();
  const { open } = useConfirmationModal();
  const { resources } = useApprovedObjects();
  const { fetchPlanet } = useSanctis();
  const { ethereum } = useWallet<ExternalProvider>();
  const [loadedInfrastructure, setLoadedInfrastructure] = useState<Infrastructure>(infrastructure);
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

    const level = await contract.level(planetId);
    const [costsResources, nextCosts] = await contract.costs(planetId);
    const nextUpgrade = await contract.nextUpgrade(planetId);
    setLoadedInfrastructure({
      ...infrastructure,
      level: level.toNumber(),
      nextUpgrade: nextUpgrade.toNumber(),
      costsResources: costsResources.map((e: string) =>
        resources.find((a) => ethers.utils.getAddress(e) === ethers.utils.getAddress(a.address))
      ),
      nextCosts,
    });

    setIsFetching(false);
  }, [isFetching, infrastructure, planetId, resources, contract, setLoadedInfrastructure]);

  useEffect(() => {
    if (!loadedInfrastructure.nextCosts || loadedInfrastructure.address !== infrastructure.address) fetch();
  }, [loadedInfrastructure, infrastructure, fetch]);

  const create = useCallback(
    async (planetId: string) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.create(planetId);
          await result.wait();
          await fetch();
          await fetchPlanet(planetId);
          toast({
            status: "success",
            title: "Created",
            description: `${infrastructure.name} has been built on Planet ${planetId}`,
          });
        } catch (err: any) {
          console.log(err);
          toast({ status: "error", title: "Error", description: `Failed creation: ${err.data.message}` });
        }
      });
    },
    [contract, infrastructure, fetch, fetchPlanet, open, toast]
  );

  const upgrade = useCallback(
    async (planetId: string) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.upgrade(planetId);
          await result.wait();
          await fetch();
          toast({
            status: "success",
            title: "Upgraded",
            description: `${infrastructure.name} has been upgraded on Planet ${planetId}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed upgrade: ${err.data.message}` });
        }
      });
    },
    [contract, infrastructure, fetch, open, toast]
  );

  return {
    infrastructure: loadedInfrastructure,
    create,
    upgrade,
  };
};

export default useInfrastructure;
