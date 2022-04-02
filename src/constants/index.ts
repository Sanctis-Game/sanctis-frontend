export interface Network {
  name: string;
  rpcUrl: string;
  chainId: number;
}

export const supportedNetworks: Network[] = [
  {
    name: "Fantom Testnet",
    rpcUrl: "https://xapi.testnet.fantom.network/lachesis",
    chainId: 4002,
  },
  {
    name: "Fantom Mainnet",
    rpcUrl: "https://rpc.fantom.network/",
    chainId: 250,
  },
];

export const deployedAddresses: { [id: number]: { [contract: string]: string } } = {
  4002: {
    sanctis: "0x38b00384411a019ad17acd3ecdfd6687166ddbce",
    credits: "0x16719a78bf9058e480ad560c95fd58b4a42134b6",
    parliament: "0xac8d703caf5b18459a489d11ba9f88a63cb666ea",
    commanders: "0x77824c38970d8e89b35d1b86288c5d06914e90fe",
    planets: "0xccee55126c061b5ad7e1515dbe9c645f013fc766",
    fleets: "0x98718b3e55809ef046f5068914d7bc8e19c30b52",
    humans: "0xee422d3c4b0af98e2b98161c9697e141aa824ae3",
    energy: "0x4a1dabd9c997eac10dfc45894aa72865d1896cb9",
    iron: "0xfaa8c657ee7cdd5f4ab7c154a285c980e5c5818a",
    deuterium: "0xfed5d78be7cfbcd1d43817e449a867c73f3f70da",
    silicon: "0x24d242e54fed65c0fa9f8d6d94f37443f6ca73cd",
    ironMines: "0x2025d85de8c74344618d8fe9782c5e78cf888eef",
    siliconFurnaces: "0xdcd62814f3cf13a05ca284d063fec4f59b2f56d0",
    heavyWaterPlants: "0x780465966e0887f305389f1a5723b85078f67e61",
    solarPanels: "0x390e22a4baf96d62b746753d8169541712f43321",
    fusionPlants: "0xa3c60c69f0ba88bf2d7ccfc0b6c76d0c3a0704c6",
    spatioports: "0xc444e15c4a4d9bd888bffa93ad181609e88554dc",
    transporters: "0xca989c9320902e5df989bbfd5180e414c178443c",
    scouts: "0x0ae19bd197b7d32bc1fc8447527c1224e31801d4",
    destroyers: "0xc291a5d4adc3cf50ce69e8423dff1370872cde81",
    resourceWrapper: "0xa9c68c7185a711bcc350bff224d9e541c4cc2f88",
  },
};

export default deployedAddresses;
