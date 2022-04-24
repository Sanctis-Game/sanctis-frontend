import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useToast } from "@chakra-ui/react";
import { ExternalProvider } from "@ethersproject/providers";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import useConfirmationModal from "hooks/useConfirmationModal";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { deployedAddresses } from "../../constants";
import CommandersABI from "../../constants/contracts/Commanders.sol/Commanders.json";
import InfrastructureABI from "../../constants/contracts/IInfrastructure.sol/IInfrastructure.json";
import PowerPlantsABI from "../../constants/contracts/IPowerPlants.sol/IPowerPlants.json";
import ResourceABI from "../../constants/contracts/IResource.sol/IResource.json";
import ResourceProducerABI from "../../constants/contracts/IResourceProducer.sol/IResourceProducer.json";
import ShipABI from "../../constants/contracts/IShip.sol/IShip.json";
import PlanetsABI from "../../constants/contracts/Planets.sol/Planets.json";
import SanctisABI from "../../constants/contracts/Sanctis.sol/Sanctis.json";
import CreditsABI from "../../constants/contracts/SpaceCredits.sol/SpaceCredits.json";
import ColonizeABI from "../../constants/contracts/Colonize.sol/Colonize.json";
import useApprovedObjects from "../../hooks/useApprovedObjects";
import useChainPicker from "../../hooks/useChainPicker";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Commander, Planet, Race, Reserve } from "./types";

export interface SanctisContextValues {
  colonizationCost?: BigNumber;
  ownedCredits?: number;
  ownedCommanders?: Commander[];
  currentCommander?: Commander;
  commanders: { [commanderId: string]: Commander };
  planets: { [planetId: string]: Planet };
  setCurrentCommander: (commander?: Commander) => void;
  fetchCommander: (commanderId: string) => Promise<Commander | undefined | null>;
  fetchPlanet: (planetId: string) => Promise<Planet | undefined | null>;
  createCommander: (name: string, race: Race) => Promise<void>;
  colonizePlanet: (commander: Commander, x: number, y: number, z: number) => Promise<void>;
}

export const SanctisContext = createContext<SanctisContextValues>({
  commanders: {},
  planets: {},
  setCurrentCommander: (commander?: Commander) => {},
  fetchCommander: () => new Promise(() => {}),
  fetchPlanet: () => new Promise(() => {}),
  createCommander: () => new Promise(() => {}),
  colonizePlanet: () => new Promise(() => {}),
});

export const SanctisProvider: React.FC = ({ children }) => {
  const toast = useToast();
  const { open } = useConfirmationModal();
  const { chainId } = useChainPicker();
  const approvedObjects = useApprovedObjects();
  const { ethereum, account } = useWallet<ExternalProvider>();

  const contracts = useMemo(() => {
    if (!ethereum) return;
    const SanctisInterface = new utils.Interface(SanctisABI.abi);
    const CommandersInterface = new utils.Interface(CommandersABI.abi);
    const CreditsInterface = new utils.Interface(CreditsABI.abi);
    const PlanetsInterface = new utils.Interface(PlanetsABI.abi);
    const ResourceInterface = new utils.Interface(ResourceABI.abi);
    const PowerPlantsInterface = new utils.Interface(PowerPlantsABI.abi);
    const ResourceProducerInterface = new utils.Interface(ResourceProducerABI.abi);
    const ShipInterface = new utils.Interface(ShipABI.abi);
    const ColonizeInterface = new utils.Interface(ColonizeABI.abi);
    const signer = new providers.Web3Provider(ethereum).getSigner();
    return {
      sanctis: new Contract(deployedAddresses[chainId].sanctis, SanctisInterface, signer),
      commanders: new Contract(deployedAddresses[chainId].commanders, CommandersInterface, signer),
      credits: new Contract(deployedAddresses[chainId].credits, CreditsInterface, signer),
      planets: new Contract(deployedAddresses[chainId].planets, PlanetsInterface, signer),
      energy: new Contract(deployedAddresses[chainId].energy, ResourceInterface, signer),
      iron: new Contract(deployedAddresses[chainId].iron, ResourceInterface, signer),
      silicon: new Contract(deployedAddresses[chainId].silicon, ResourceInterface, signer),
      deuterium: new Contract(deployedAddresses[chainId].deuterium, ResourceInterface, signer),
      solarPanels: new Contract(deployedAddresses[chainId].solarPanels, PowerPlantsInterface, signer),
      fusionReactors: new Contract(deployedAddresses[chainId].fusionReactors, PowerPlantsInterface, signer),
      ironMines: new Contract(deployedAddresses[chainId].ironMines, ResourceProducerInterface, signer),
      siliconFurnaces: new Contract(deployedAddresses[chainId].siliconFurnaces, ResourceProducerInterface, signer),
      heavyWaterPlants: new Contract(deployedAddresses[chainId].heavyWaterPlants, ResourceProducerInterface, signer),
      transporters: new Contract(deployedAddresses[chainId].transporters, ShipInterface, signer),
      scouts: new Contract(deployedAddresses[chainId].scouts, ShipInterface, signer),
      destroyers: new Contract(deployedAddresses[chainId].destroyers, ShipInterface, signer),
      colonize: new Contract(deployedAddresses[chainId].colonize, ColonizeInterface, signer),
    };
  }, [chainId, ethereum]);

  const [ownedCredits, setOwnedCredits] = useState<number>();
  const [ownedCommanders, setOwnedCommanders] = useState<Commander[]>();
  const [commanders, setCommanders] = useState<{ [commanderId: string]: Commander }>({});
  const [memorizedCommander, setMemorizedCommander] = useLocalStorage<Commander | undefined>(
    "memorized_commander",
    undefined
  );
  const [owner, setOwner] = useLocalStorage<string | null>("memorized_owner", null);
  const [currentCommander, setCurrentCommanderState] = useState<Commander | undefined>();
  const [planets, setPlanets] = useState<{ [planetId: string]: Planet }>({});
  const [colonizationCost, setColonizationCost] = useState<BigNumber>();

  const setCurrentCommander = useCallback(
    (commander?: Commander) => {
      setMemorizedCommander(commander);
      setOwner(account);
      setCurrentCommanderState(commander);
    },
    [account, setOwner, setMemorizedCommander, setCurrentCommanderState]
  );

  useEffect(() => {
    if (
      account &&
      memorizedCommander &&
      ownedCommanders &&
      ownedCommanders.find((e) => e.id === memorizedCommander.id) &&
      owner === account
    ) {
      setCurrentCommander(memorizedCommander);
    } else if (account && account !== owner) {
      setCurrentCommander(undefined);
    }
  }, [memorizedCommander, owner, account, ownedCommanders, setCurrentCommander]);

  const fetchColonizationCost = useCallback(async () => {
    if (!contracts) return;
    setColonizationCost(await contracts.colonize.colonizationCost());
  }, [contracts]);

  useEffect(() => {
    fetchColonizationCost();
  }, [fetchColonizationCost]);

  const fetchOwnedCredits = useCallback(async () => {
    if (!contracts || !account) return;
    setOwnedCredits(Number(ethers.utils.formatEther(await contracts.credits.balanceOf(account))));
  }, [contracts, account]);

  useEffect(() => {
    fetchOwnedCredits();
  }, [fetchOwnedCredits]);

  const fetchCommander = useCallback(
    async (commanderId: string) => {
      if (!contracts) return;

      try {
        const [name, race] = await contracts.commanders.commander(commanderId);
        // TODO: Fetch planets using The Graph
        const commander: Commander = {
          id: commanderId,
          name,
          race: approvedObjects.races.find((e) => e.address === race),
          planets: [],
        };
        setCommanders((old) => {
          old[commanderId] = commander;
          return old;
        });
        return commander;
      } catch (err) {
        console.log("Error fetching commander:", err);
        return null;
      }
    },
    [approvedObjects, contracts]
  );

  const fetchOwnedCommanders = useCallback(async () => {
    if (!contracts || !account) return;

    const commandersBalance = (await contracts.commanders.balanceOf(account)).toNumber();

    if (ownedCommanders?.length === commandersBalance) return;

    const commanders = (
      await Promise.all(
        Array(commandersBalance)
          .fill(0)
          .map(
            async (_, i) =>
              (await fetchCommander((await contracts.commanders.tokenOfOwnerByIndex(account, i)).toString()))!
          )
      )
    ).filter(Boolean);

    setOwnedCommanders(commanders);
  }, [account, contracts, ownedCommanders, fetchCommander]);

  useEffect(() => {
    fetchOwnedCommanders();
  }, [fetchOwnedCommanders]);

  const fetchPlanet = useCallback(
    async (planetId: string) => {
      if (!contracts) return;
      try {
        const { status, ruler, x, y, z, humidity } = await contracts.planets.planet(planetId);
        const reserves: Reserve[] = await Promise.all(
          approvedObjects.resources.map(async (resource) => {
            const ResourceInterface = new utils.Interface(ResourceABI.abi);
            const contract = new Contract(
              resource.address,
              ResourceInterface,
              new providers.Web3Provider(ethereum).getSigner()
            );
            return {
              resource,
              amount: await contract.reserve(planetId),
            };
          })
        );
        const infrastructures = await Promise.all(
          approvedObjects.infrastructures.map(async (infrastructure) => {
            const InfrastructureInterface = new utils.Interface(InfrastructureABI.abi);
            const contract = new Contract(
              infrastructure.address,
              InfrastructureInterface,
              new providers.Web3Provider(ethereum).getSigner()
            );
            return {
              ...infrastructure,
              level: (await contract.level(planetId)).toNumber(),
            };
          })
        );
        const planet = {
          id: planetId,
          status: status,
          ruler: ruler.toString(),
          x: x.toNumber(),
          y: y.toNumber(),
          z: z.toNumber(),
          humidity: humidity,
          infrastructures: infrastructures,
          reserves: reserves,
        };
        setPlanets((old) => {
          old[planetId] = planet;
          return old;
        });
        return planet;
      } catch (err) {
        console.log("Error fetching planet:", err);
        return null;
      }
    },
    [approvedObjects, contracts, ethereum]
  );

  const createCommander = useCallback(
    async (name: string, race: Race) => {
      if (!contracts) return;
      open(async () => {
        try {
          const result = await contracts.commanders.create(name, race.address);
          await result.wait();
          await fetchOwnedCommanders();
          toast({ status: "success", title: "Created", description: `The world awaits your order, Commander ${name}` });
        } catch (err: any) {
          toast({ status: "error", title: "Error", description: `Failed creation: ${err.message}` });
        }
      });
    },
    [contracts, open, toast, fetchOwnedCommanders]
  );

  const colonizePlanet = useCallback(
    async (commander: Commander, x: number, y: number, z: number) => {
      if (!contracts) return;

      open(async () => {
        try {
          const planetId = BigNumber.from(z).toTwos(80).shl(80).add(y).shl(80).add(x);
          const result = await contracts.colonize.colonize(commander.id, planetId);
          await result.wait();
          await fetchPlanet(planetId.toString());
          await fetchOwnedCredits();
          await fetchCommander(commander.id);
          toast({ status: "success", title: "Created", description: `A new planet has been colonized` });
        } catch (err: any) {
          console.log(err);
          toast({ status: "error", title: "Error", description: `Failed colonization: ${err.message}` });
        }
      });
    },
    [contracts, open, toast, fetchCommander, fetchPlanet, fetchOwnedCredits]
  );

  return (
    <SanctisContext.Provider
      value={{
        colonizationCost,
        ownedCredits,
        ownedCommanders,
        commanders,
        planets,
        currentCommander,
        setCurrentCommander,
        fetchCommander,
        fetchPlanet,
        createCommander,
        colonizePlanet,
      }}
    >
      {children}
    </SanctisContext.Provider>
  );
};

export default SanctisProvider;
