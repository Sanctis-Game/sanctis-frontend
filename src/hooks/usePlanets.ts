import { useCallback, useEffect, useMemo, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Planet } from "../contexts/Sanctis/types";

const APIURL = "https://api.thegraph.com/subgraphs/name/sanctis-game/planets";

const tokensQuery = `
  query {
    planets(first: 5) {
      id
      x
      y
      z
    }
  }
`;

const usePlanets = () => {
  const [planets, setPlanets] = useState<Planet[]>();
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      }),
    []
  );

  const fetch = useCallback(async () => {
    const result = await client.query({
      query: gql(tokensQuery),
    });

    setPlanets(result.data);

    console.log("Subgraph data planets: ", result);
  }, [client]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return planets;
};

export default usePlanets;
