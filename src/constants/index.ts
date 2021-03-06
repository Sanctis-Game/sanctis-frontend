export interface Network {
  name: string;
  rpcUrl: string;
  chainId: number;
}

export const supportedNetworks: Network[] = [
  // {
  //   name: "Fantom Testnet",
  //   rpcUrl: "https://xapi.testnet.fantom.network/lachesis",
  //   chainId: 4002,
  // },
  {
    name: "Polygon Testnet (Mumbai)",
    rpcUrl: "https://matic-mumbai.chainstacklabs.com",
    chainId: 80001,
  },
  // {
  //   name: "Fantom Mainnet",
  //   rpcUrl: "https://rpc.fantom.network/",
  //   chainId: 250,
  // },
];

export const deployedAddresses: { [id: number]: { [contract: string]: string } } = {
  4002: {
    sanctis: "0x82796af064346a29d5a27057d16a28be0c4b3316",
    credits: "0x9abbbddbd5e6bf2697c4eb8109e7bd4335e40bb1",
    parliament: "0xacec97ae37b3fd23d699251a341e902689e1c238",
    commanders: "0x3032804c781d518f554b4e5e0e179103b15eab34",
    planets: "0x2620ae485267a456d5fe872bef584b4a52c243e2",
    fleets: "0x08fd27f8dd1e2b28b2ce99572e0699c0364f0d29",
    humans: "0x989c5d11a3607cd3d5663dd2c89f9d70e63bbf9c",
    energy: "0x9023550b35e8438734d6f541648ea036a46033d4",
    iron: "0x84b288f20389aa710b7ff0232e48c4608b731fb8",
    deuterium: "0xdd7e06e51a748acacd6574d26bb73d027667f08c",
    silicon: "0x7a19b32208ceaa7567fe412af85e05403021cef8",
    ironMines: "0x5571c77a08c57548eca2f619e192a2eeebdbde9b",
    siliconFurnaces: "0xefdfe52bd8b7d30a1a8bd969f64e635b1fc82897",
    heavyWaterPlants: "0x5c40018bdc649998029b549ee93e05bf82b9cfce",
    solarPanels: "0x0d911b301015e69754e1dea19255e65890f362df",
    fusionReactors: "0x8c36ccff8265a3e8a5fe4623903fa1284ef26beb",
    spatioports: "0xa569f91ab1038416239635ce84917e8a2c2b1f68",
    transporters: "0x911361700250b3a17b56fd0b874ba3799b1f4bc3",
    scouts: "0xfdb621612cae882d3de41f46de3da9e9c8f81da6",
    destroyers: "0xceacea7a31c308f082cf7cb0273d6b22948bfa22",
    plundering: "0x8febd06842530cbc196178630a6d3708f886b075",
    resourceWrapper: "0x43d37eb9f543bc45dab093ecae13f899e637ceec",
  },
  80001: {
    sanctis: "0x7e473a878608ca239173f5ae0e36673ca986f57e",
    credits: "0x0867903f73ea5b2f0a435980ee405b7018ed073b",
    parliament: "0x005ceb63ecf96ca25c718e0ecad307869604810b",
    commanders: "0x837d5deff7431596842b76f67ea740bf0eb8e43e",
    planets: "0xec1887f54398474a6eb8f655a1d80c15adb5d4cc",
    fleets: "0x2f66d04bd487a01419dec464197fd5efb3728442",
    humans: "0xa1da4b58792754c2b080e79fa44af7fb93d7a61b",
    energy: "0x509ea76b6b03fe1a7d59f432dbe4592dba47c322",
    iron: "0x3c506fb196d7e64222f4aec753a80b81fe2d7cb2",
    deuterium: "0xd1b0c426c267b138ffffd5b765de36da8b561a16",
    silicon: "0x82d0770cde70fc414010ef23d4039304912bed77",
    ironMines: "0xfa945e1e4e6a9820b87ae39a73afe4eb22477f41",
    siliconFurnaces: "0xb1c30f4d9e987ae574d6bfdbebf02f013cfc1dbc",
    heavyWaterPlants: "0x26c861ad93accc9a4274d062fa905b6e17eabab8",
    solarPanels: "0x08f44399465cf3362cb55915a8f7fe37315c33c7",
    fusionReactors: "0xb5866cd7522c36882209d9de1c3db37659c5b1dd",
    spatioports: "0x55b2aaacf1e79852930790448f79f4cb28acbb10",
    transporters: "0x6415af0dc052f70c65606aed8375a39f1f5b4daa",
    scouts: "0xbbfdbfadcad882ccd8702eb5adb8f7a04cbcfbb4",
    destroyers: "0x2f1ba24d68e3fdd6909f00a415694dd1a59f8cda",
    plundering: "0x2c5cfa80741af895d68cc72e28adb7520fa94628",
    colonize: "0xd4232b5c6b8a3c539086ce9b3ff9aa5e4b214868",
    resourceWrapper: "0xdef8906f3f7e6b37695233ff5aa7bca14c1bd10c",
  },
};

export default deployedAddresses;
