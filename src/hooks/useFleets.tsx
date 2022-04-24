import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useToast } from "@chakra-ui/react";
import { ExternalProvider } from "@ethersproject/providers";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import deployedAddresses from "../constants";

import FleetsABI from "../constants/contracts/IFleets.sol/IFleets.json";
import { Commander, Fleet, FleetStatus, Planet, Reserve, Resource, Ship } from "../contexts/Sanctis/types";
import useApprovedObjects from "./useApprovedObjects";
import useChainPicker from "./useChainPicker";
import useConfirmationModal from "./useConfirmationModal";
import useSanctis from "./useSanctis";

const APIURL = "https://api.thegraph.com/subgraphs/name/sanctis-game/fleets";

const tokensQuery = `
  query {
    fleets(first: 5) {
      id
      status
      to
      from
    }
  }
`;

const useFleets = ({ planet }: { planet?: Planet } = {}) => {
  const toast = useToast();
  const { open } = useConfirmationModal();
  const { chainId } = useChainPicker();
  const { ethereum } = useWallet<ExternalProvider>();
  const { fetchPlanet } = useSanctis();
  const { ships: approvedShips, resources: approvedResources } = useApprovedObjects();
  const [fleets, setFleets] = useState<Fleet[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const contract = useMemo(() => {
    if (!ethereum) return;
    const FleetInterface = new utils.Interface(FleetsABI.abi);
    return new Contract(
      deployedAddresses[chainId].fleets,
      FleetInterface,
      new providers.Web3Provider(ethereum).getSigner()
    );
  }, [ethereum, chainId]);

  const client = useMemo(
    () =>
      new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      }),
    []
  );

  const fetchFleets = useCallback(async () => {
    const result = await client.query({
      query: gql(tokensQuery),
    });

    console.log("Subgraph fleets: ", result);
    setFleets(result.data.fleets.map((e: any) => ({ id: e.id, shipsInFleet: {}, resources: [] })));
  }, [client]);

  useEffect(() => {
    fetchFleets();
  }, [fetchFleets]);

  const fetchFleet = useCallback(
    async (fleetId: BigNumber) => {
      if (!contract) return;

      const {
        commander,
        fromPlanetId,
        toPlanetId,
        totalSpeed,
        totalOffensivePower,
        totalDefensivePower,
        capacity,
        ships,
        arrivalBlock,
        status,
      } = await contract.fleet(fleetId);
      const fromPlanet = await fetchPlanet(fromPlanetId);
      const toPlanet = await fetchPlanet(toPlanetId);

      const fleetStatus = (id: number) => {
        switch (id) {
          default:
            return FleetStatus.Preparing;
          case 0:
            return FleetStatus.Preparing;
          case 1:
            return FleetStatus.Orbitting;
          case 2:
            return FleetStatus.Travelling;
        }
      };

      const shipsInFleet: { [address: string]: number } = {};
      await Promise.all(
        approvedShips.map(async (ship) => {
          shipsInFleet[ship.address] = (await contract.shipsInFleet(ship.address, fleetId)).toNumber();
        })
      );

      const resourcesInFleet: Reserve[] = [];
      await Promise.all(
        approvedResources.map(async (resource) => {
          resourcesInFleet.push({ resource: resource, amount: await contract.shipsInFleet(resource.address, fleetId) });
        })
      );

      return {
        id: fleetId.toString(),
        commander,
        fromPlanet: fromPlanet || undefined,
        toPlanet: toPlanet || undefined,
        totalSpeed,
        totalOffensivePower,
        totalDefensivePower,
        capacity,
        ships,
        arrivalBlock: arrivalBlock.toNumber(),
        status: fleetStatus(status.toNumber()),
        shipsInFleet: shipsInFleet,
        resources: resourcesInFleet,
      };
    },
    [approvedResources, approvedShips, contract, fetchPlanet]
  );

  const fetchPlanetFleets = useCallback(
    async (planetId?: string) => {
      if (!contract || isFetching) return;
      setIsFetching(true);

      const fleetsOnPlanet = await contract.fleetsOnPlanet(planetId);

      const fleets: Fleet[] = await Promise.all(
        Array(fleetsOnPlanet.toNumber())
          .fill(0)
          .map(async (_, i) => (await fetchFleet(await contract.fleetOnPlanetByIndex(planetId, i)))!)
      );

      // Assign it to the planets fleets
      setFleets(fleets.filter(Boolean));
      setIsFetching(false);
    },
    [isFetching, contract, fetchFleet]
  );

  useEffect(() => {
    if (!fleets && planet) fetchPlanetFleets(planet.id);
  }, [fleets, planet, fetchPlanetFleets]);

  const create = useCallback(
    async (commander: Commander, planetId: string) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.createFleet(commander.id, planetId);
          await result.wait();
          await fetchPlanetFleets(planetId);
          toast({
            status: "success",
            title: "Creation",
            description: `A fleet has been created on Planet ${planetId}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed creation: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, open, toast]
  );

  const move = useCallback(
    async (fleet: Fleet, to: Planet) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.moveFleet(fleet.id, to.id);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          toast({
            status: "success",
            title: "Creation",
            description: `A fleet has been created on Planet ${fleet.fromPlanet?.id}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed creation: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, open, toast]
  );

  const addToFleet = useCallback(
    async (fleet: Fleet, ship: Ship, quantity: number) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.addToFleet(fleet.id, ship.address, quantity);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          toast({
            status: "success",
            title: "Add to fleet",
            description: `${quantity} ${ship.name} have been added to fleet ${fleet.id}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed adding: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, open, toast]
  );

  const removeFromFleet = useCallback(
    async (fleet: Fleet, ship: Ship, quantity: number) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.removeFromFleet(fleet.id, ship.address, quantity);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          toast({
            status: "success",
            title: "Remove from fleet",
            description: `${quantity} ${ship.name} have been removed from fleet ${fleet.id}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed removing: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, open, toast]
  );

  const putInOrbit = useCallback(
    async (fleet: Fleet) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.putInOrbit(fleet.id);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          toast({
            status: "success",
            title: "Put in orbit",
            description: `Fleet ${fleet.id} has been put in orbit`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed putting in orbit: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, open, toast]
  );

  const land = useCallback(
    async (fleet: Fleet) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.land(fleet.id);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          toast({
            status: "success",
            title: "Landing",
            description: `Fleet ${fleet.id} has landed`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed landing: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, open, toast]
  );

  const loadResource = useCallback(
    async (fleet: Fleet, resource: Resource, quantity: BigNumber) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.load(fleet.id, resource.address, quantity);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          await fetchPlanet(fleet.fromPlanet!.id);
          toast({
            status: "success",
            title: "Loaded",
            description: `Fleet ${fleet.id} loaded ${ethers.utils.formatEther(quantity)} ${resource.name}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed loading: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, fetchPlanet, open, toast]
  );

  const unloadResource = useCallback(
    async (fleet: Fleet, resource: Resource, quantity: BigNumber) => {
      if (!contract) return;
      open(async () => {
        try {
          const result = await contract.unload(fleet.id, resource.address, quantity);
          await result.wait();
          await fetchPlanetFleets(fleet.fromPlanet?.id);
          await fetchPlanet(fleet.fromPlanet!.id);
          toast({
            status: "success",
            title: "Unloaded",
            description: `Fleet ${fleet.id} unloaded ${ethers.utils.formatEther(quantity)} ${resource.name}`,
          });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed unloading: ${err.message}` });
        }
      });
    },
    [contract, fetchPlanetFleets, fetchPlanet, open, toast]
  );

  return {
    fleets,
    create,
    move,
    addToFleet,
    removeFromFleet,
    putInOrbit,
    land,
    loadResource,
    unloadResource,
  };
};

export default useFleets;
