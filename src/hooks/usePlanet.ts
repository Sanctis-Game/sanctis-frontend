import { Planet } from "contexts/Sanctis/types";
import { useCallback, useEffect, useState } from "react";
import useSanctis from "./useSanctis";

export default function usePlanet(planetId?: string) {
  const { planets, fetchPlanet } = useSanctis()
  const [planet, setPlanet] = useState<Planet | null>()

  const fetch = useCallback(async () => {
    if(!planetId) return
    else if(!planets[planetId]) {
      setPlanet(await fetchPlanet(planetId))
    } else {
      setPlanet(planets[planetId])
    }
  }, [planets, planetId, fetchPlanet])

  useEffect(() =>  {
    fetch()
  }, [fetch])

  return planet
}