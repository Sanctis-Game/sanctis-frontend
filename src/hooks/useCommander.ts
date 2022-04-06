import { Commander } from "contexts/Sanctis/types";
import { useCallback, useEffect, useState } from "react";
import useSanctis from "./useSanctis";

export default function useCommander(id: number) {
  const { commanders, fetchCommander } = useSanctis();
  const [commander, setCommander] = useState<Commander | null>();

  const fetch = useCallback(async () => {
    if (!commanders[id]) {
      setCommander(await fetchCommander(id));
    } else {
      setCommander(commanders[id]);
    }
  }, [commanders, id, fetchCommander]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return commander;
}
