import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ExternalProvider } from '@ethersproject/providers'
import { BigNumber, Contract, providers, utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import PowerPlantABI from '../constants/contracts/IPowerPlants.sol/IPowerPlants.json'
import { Infrastructure, Resource } from '../contexts/Sanctis/types'
import useApprovedObjects from './useApprovedObjects'
import useInfrastructure from './useInfrastructure'

export interface PowerPlantCharacteristics extends Infrastructure {
  energy?: Resource;
  currentProduction?: BigNumber;
  nextProduction?: BigNumber;
}

const usePowerPlant = (infrastructure: Infrastructure, planetId: string) => {
  const { ethereum } = useWallet<ExternalProvider>();
  const { resources } = useApprovedObjects();
  const { infrastructure: baseInfra, create, upgrade } = useInfrastructure(infrastructure, planetId);
  const [loadedPlant, setLoadedPlant] = useState<PowerPlantCharacteristics>(infrastructure);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const contract = useMemo(() => {
    if (!ethereum) return;

    const PowerPlantInterface = new utils.Interface(PowerPlantABI.abi);
    return new Contract(infrastructure.address, PowerPlantInterface, new providers.Web3Provider(ethereum).getSigner());
  }, [ethereum, infrastructure]);

  const fetch = useCallback(async () => {
    if (!contract || isFetching) return;
    setIsFetching(true);
    try {
      const currentProduction = await contract.currentProduction(planetId);
      const nextProduction = await contract.nextProduction(planetId);
      setLoadedPlant({
        ...baseInfra,
        energy: resources.find((e) => e.name === "Energy")!,
        currentProduction: currentProduction,
        nextProduction: nextProduction,
      });
    } catch (err: any) {
      console.log("Failed fetching resource producer", err);
    }
    setIsFetching(false);
  }, [contract, isFetching, baseInfra, planetId, resources, setLoadedPlant]);

  useEffect(() => {
    if (!loadedPlant.costsResources || !loadedPlant.nextCosts) fetch();
  }, [loadedPlant, fetch]);

  return {
    powerPlant: loadedPlant,
    fetch,
    create,
    upgrade,
  };
};

export default usePowerPlant;
