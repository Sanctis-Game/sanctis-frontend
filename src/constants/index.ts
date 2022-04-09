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
    "sanctis": "0x82796af064346a29d5a27057d16a28be0c4b3316",
    "credits": "0x9abbbddbd5e6bf2697c4eb8109e7bd4335e40bb1",
    "parliament": "0xacec97ae37b3fd23d699251a341e902689e1c238",
    "commanders": "0x3032804c781d518f554b4e5e0e179103b15eab34",
    "planets": "0x2620ae485267a456d5fe872bef584b4a52c243e2",
    "fleets": "0x08fd27f8dd1e2b28b2ce99572e0699c0364f0d29",
    "humans": "0x989c5d11a3607cd3d5663dd2c89f9d70e63bbf9c",
    "energy": "0x9023550b35e8438734d6f541648ea036a46033d4",
    "iron": "0x84b288f20389aa710b7ff0232e48c4608b731fb8",
    "deuterium": "0xdd7e06e51a748acacd6574d26bb73d027667f08c",
    "silicon": "0x7a19b32208ceaa7567fe412af85e05403021cef8",
    "ironMines": "0x5571c77a08c57548eca2f619e192a2eeebdbde9b",
    "siliconFurnaces": "0xefdfe52bd8b7d30a1a8bd969f64e635b1fc82897",
    "heavyWaterPlants": "0x5c40018bdc649998029b549ee93e05bf82b9cfce",
    "solarPanels": "0x0d911b301015e69754e1dea19255e65890f362df",
    "fusionReactors": "0x8c36ccff8265a3e8a5fe4623903fa1284ef26beb",
    "spatioports": "0xa569f91ab1038416239635ce84917e8a2c2b1f68",
    "transporters": "0x911361700250b3a17b56fd0b874ba3799b1f4bc3",
    "scouts": "0xfdb621612cae882d3de41f46de3da9e9c8f81da6",
    "destroyers": "0xceacea7a31c308f082cf7cb0273d6b22948bfa22",
    "plundering": "0x8febd06842530cbc196178630a6d3708f886b075",
    "resourceWrapper": "0x43d37eb9f543bc45dab093ecae13f899e637ceec"
  },
};

export default deployedAddresses;