import { useWallet } from "@binance-chain/bsc-use-wallet";
import { ExternalProvider } from "@ethersproject/providers";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";

import ShipABI from "../constants/contracts/IShip.sol/IShip.json";
import { Infrastructure, Planet, Resource, Ship } from "../contexts/Sanctis/types";
import useApprovedObjects from "./useApprovedObjects";

export interface PowerPlantCharacteristics extends Infrastructure {
  energy?: Resource;
  currentProduction?: BigNumber;
  nextProduction?: BigNumber;
}

const useShip = (ship: Ship, planet?: Planet) => {
  const { ethereum } = useWallet<ExternalProvider>();
  const { resources } = useApprovedObjects();
  const [loadedShip, setLoadedShip] = useState<Ship>(ship);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const contract = useMemo(() => {
    if (!ethereum) return;

    const ShipInterface = new utils.Interface(ShipABI.abi);
    return new Contract(ship.address, ShipInterface, new providers.Web3Provider(ethereum).getSigner());
  }, [ethereum, ship]);

  const fetch = useCallback(async () => {
    if (!contract || isFetching) return;
    setIsFetching(true);
    try {
      const [costsResources, costs] = await contract.unitCosts();
      const speed = await contract.speed();
      const offensivePower = await contract.offensivePower();
      const defensivePower = await contract.defensivePower();
      const capacity = await contract.capacity();
      const reserve = planet ? (await contract.reserve(planet.id)).toNumber() : 0;
      setLoadedShip({
        ...ship,
        costsResources: costsResources.map((e: string) =>
          resources.find((a) => ethers.utils.getAddress(e) === ethers.utils.getAddress(a.address))
        ),
        costs,
        speed: speed.toNumber(),
        offensivePower: offensivePower.toNumber(),
        defensivePower: defensivePower.toNumber(),
        capacity: capacity,
        reserve,
      });
    } catch (err: any) {
      console.log("Failed fetching ship", err);
    }
    setIsFetching(false);
  }, [contract, isFetching, ship, planet, resources, setLoadedShip]);

  useEffect(() => {
    if (!loadedShip.costsResources || loadedShip.address !== ship.address) fetch();
  }, [loadedShip, ship, fetch]);

  return {
    ship: loadedShip,
    fetch,
  };
};

export default useShip;
