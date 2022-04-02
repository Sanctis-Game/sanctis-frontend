import { useContext } from "react";

import { SanctisContext } from "../contexts/Sanctis";

const useSanctis = () => {
  return {
    ...useContext(SanctisContext),
  };
};

export default useSanctis;
