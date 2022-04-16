import { IconType } from "react-icons";
import { BiPlanet } from "react-icons/bi";
import { FiCompass, FiHome, FiBook } from "react-icons/fi";
import { SiStarship } from "react-icons/si";
import { BsFillPersonFill } from "react-icons/bs";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}
export const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, url: "/" },
  { name: "Commanders", icon: BsFillPersonFill, url: "/commanders" },
  { name: "Planets", icon: BiPlanet, url: "/planets" },
  { name: "Fleets", icon: SiStarship, url: "/fleets" },
  { name: "Explore", icon: FiCompass, url: "/explore" },
  { name: "Documentation", icon: FiBook, url: "/documentation" },
];
