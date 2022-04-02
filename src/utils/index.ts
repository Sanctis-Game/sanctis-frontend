import { BigNumber } from "ethers";

export const shortAddress = (address: string | undefined): string => {
  if (!address) return "???";
  return (
    address.substring(0, 4) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

export const planetIdToCoordinate = (planetId: string) => {
  const num = BigNumber.from(planetId)
  const bits80 = BigNumber.from("0xFFFFF")
  const x = num.and(bits80)
  const y = num.shr(80).and(bits80)
  const z = num.shr(160).and(bits80)
  return `(X=${x}; Y=${y}; Z=${z})`
}