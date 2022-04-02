import { Infrastructure, Race, Resource, Ship } from "../contexts/Sanctis/types";
import useChainPicker from "./useChainPicker";
import deployedAddresses from "../constants";
import energy from "../assets/electric.svg"
import metalBar from "../assets/metal-bar.svg"
import ore from "../assets/ore.svg"
import deuterium from "../assets/topaz.svg"

const useApprovedObjects = () => {
  const { chainId } = useChainPicker()

  const races: Race[] = [
    { name: 'Human', address: deployedAddresses[chainId].humans }
  ]
  const resources: Resource[] = [
    { name: 'Energy', address: deployedAddresses[chainId].energy, icon: energy },
    { name: 'Iron', address: deployedAddresses[chainId].iron, icon: metalBar },
    { name: 'Silicon', address: deployedAddresses[chainId].silicon, icon: ore },
    { name: 'Deuterium', address: deployedAddresses[chainId].deuterium, icon: deuterium },
  ]
  const infrastructures: Infrastructure[] = [
    { name: 'Iron mines', description: 'It extracts a constant rate of iron.', address: deployedAddresses[chainId].ironMines },
    { name: 'Silicon Furnaces', description: 'It produces silicon at a constant rate.', address: deployedAddresses[chainId].siliconFurnaces },
    { name: 'Heavy Water Plants', description: 'Used to concentrate deuterium.', address: deployedAddresses[chainId].heavyWaterPlants },
    { name: 'Solar Panels', description: 'Harvests the energy of the nearby star', address: deployedAddresses[chainId].solarPanels },
    { name: 'Fusion Reactors', description: 'Fuses deuterium isotopes to create energy.', address: deployedAddresses[chainId].fusionPlants },
    { name: 'Spatioports', description: 'A building necessary to build ships', address: deployedAddresses[chainId].spatioports },
  ]
  const ships: Ship[] = [
    { name: 'Transporters', description: 'Small ships used to transports resources around.', address: deployedAddresses[chainId].transporters },
    { name: 'Scouts', description: 'Fast reconnaissance units.', address: deployedAddresses[chainId].scouts },
    { name: 'Destroyers', description: "Heavily armed ships used to take down ennemy's fleets", address: deployedAddresses[chainId].destroyers }
  ]

  return {
    races,
    resources,
    infrastructures,
    ships
  }
};

export default useApprovedObjects;
