import { useCallback, useEffect, useMemo, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Planet } from "../contexts/Sanctis/types";
import { BigNumber } from "ethers";

const APIURL = "https://api.thegraph.com/subgraphs/name/sanctis-game/planets";

const usePlanets = ({ center, radius, ruler }: { center?: Planet, radius?: BigNumber, ruler?: string } = {}) => {
  const [planets, setPlanets] = useState<Planet[]>();
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      }),
    []
  );
  const tokensQuery = useMemo(() => {
    const lowerX = (center?.x || BigNumber.from(0)).sub(radius || BigNumber.from(2).pow(79))
    const upperX = (center?.x || BigNumber.from(0)).add(radius || BigNumber.from(2).pow(79))
    const lowerY = (center?.y || BigNumber.from(0)).sub(radius || BigNumber.from(2).pow(79))
    const upperY = (center?.y || BigNumber.from(0)).add(radius || BigNumber.from(2).pow(79))
    const lowerZ = (center?.z || BigNumber.from(0)).sub(radius || BigNumber.from(2).pow(79))
    const upperZ = (center?.z || BigNumber.from(0)).add(radius || BigNumber.from(2).pow(79))

    return `
    query {
      planets(where: {
          ${ruler ? ` ruler: "${ruler}",` : ""}
          x_lte: "${upperX.toString()}",
          x_gte: "${lowerX.toString()}",
          y_lte: "${upperY.toString()}",
          y_gte: "${lowerY.toString()}",
          z_lte: "${upperZ.toString()}",
          z_gte: "${lowerZ.toString()}"
      }) {
        id
        ruler
        x
        y
        z
        status
      }
    }`
  }, [center, radius, ruler]);

  const fetch = useCallback(async () => {
    const result = await client.query({
      query: gql(tokensQuery),
    });

    setPlanets(result.data.planets.map((e: any) => {
      const { id, ruler, status, x, y, z } = e
      return { id, ruler, status, x, y, z }
    }));

    console.log("Subgraph data planets: ", result);
  }, [client, tokensQuery]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return planets;
};

export default usePlanets;
