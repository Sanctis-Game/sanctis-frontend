import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { utils, Contract, providers, ethers, BigNumber } from 'ethers'
import { ExternalProvider } from "@ethersproject/providers"
import { useWallet } from "@binance-chain/bsc-use-wallet";

import ResourceProducerABI from "../constants/contracts/IResourceProducer.sol/IResourceProducer.json"
import { Infrastructure, Resource } from "../contexts/Sanctis/types";
import useConfirmationModal from "./useConfirmationModal";
import useInfrastructure from "./useInfrastructure";
import useApprovedObjects from "./useApprovedObjects";
import useSanctis from "./useSanctis";

export interface ResourceProducerCharacteristics extends Infrastructure {
  lastHarvest?: number
  nextUpgrade?: number
  producedResources?: Resource[]
  productionPerBlock?: BigNumber[]
  costsResources?: Resource[]
}

const useResourceProducer = (infrastructure: Infrastructure, planetId: string) => {
  const toast = useToast()
  const { open } = useConfirmationModal()
  const { ethereum } = useWallet<ExternalProvider>()
  const { resources } = useApprovedObjects()
  const { fetchPlanet } = useSanctis()
  const { create, upgrade } = useInfrastructure(infrastructure, planetId)
  const [loadedProducer, setLoadedProducer] = useState<ResourceProducerCharacteristics>(infrastructure)

  const contract = useMemo(() => {
    if (!ethereum) return
    const ResourceProducerInterface = new utils.Interface(ResourceProducerABI.abi)
    return new Contract(infrastructure.address, ResourceProducerInterface, new providers.Web3Provider(ethereum).getSigner())
  }, [ethereum, infrastructure])

  const fetch = useCallback(async (): Promise<ResourceProducerCharacteristics | undefined> => {
    if (!contract) return
    try
    {
      const characteristics = await contract.characteristics(planetId)
      setLoadedProducer({
        ...infrastructure,
        level: characteristics.level.toNumber(),
        lastHarvest: characteristics.lastHarvest.toNumber(),
        nextUpgrade: characteristics.nextUpgrade.toNumber(),
        producedResources: characteristics.producedResources.map((e: string) => resources.find(a => ethers.utils.getAddress(e) === ethers.utils.getAddress(a.address))),
        productionPerBlock: characteristics.productionPerBlock.map((e: any) => BigNumber.from(e)),
        costsResources: characteristics.costsResources.map((e: string) => resources.find(a => ethers.utils.getAddress(e) === ethers.utils.getAddress(a.address))),
        nextCosts: characteristics.nextCosts,
      })
    } catch (err: any)
    {
      console.log("Failed fetching resource producer", err)
    }
  }, [contract, infrastructure, planetId, resources, setLoadedProducer])

  useEffect(() => {
    if (!loadedProducer.costsResources || !loadedProducer.nextCosts)
      fetch()
  }, [loadedProducer, fetch])

  const harvest = useCallback(async (planetId: string) => {
    if (!contract) return
    open(async () => {
      try
      {
        const result = await contract.harvest(planetId)
        await result.wait()
        await fetch()
        await fetchPlanet(planetId)
        toast({ status: 'success', title: 'Harvest', description: `An ${infrastructure.name} has been harvested on Planet ${planetId}` })
      } catch (err: any)
      {
        toast({ status: 'error', title: 'Error', description: `Failed harvest: ${err.data?.message || err.message}` })
      }
    })
  }, [contract, infrastructure, fetch, fetchPlanet, open, toast])

  return {
    producer: loadedProducer,
    fetch,
    create,
    upgrade,
    harvest
  }
};

export default useResourceProducer;
