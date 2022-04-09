import { IconType } from "react-icons";
import { FiCompass, FiHome, FiTrendingUp, FiBook } from "react-icons/fi";
import { SiStarship } from "react-icons/si";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}
export const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, url: "/" },
  { name: "Commanders", icon: FiTrendingUp, url: "/commanders" },
  { name: "Planets", icon: FiCompass, url: "/planets" },
  { name: "Fleets", icon: SiStarship, url: "/fleets" },
  { name: "Documentation", icon: FiBook, url: "/documentation" },
];
