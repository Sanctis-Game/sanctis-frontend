import { IconType } from "react-icons";
import { FiCompass, FiHome, FiSettings, FiStar, FiTrendingUp } from "react-icons/fi";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}
export const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, url: '/' },
  { name: 'Commanders', icon: FiTrendingUp, url: '/commanders' },
  { name: 'Explore', icon: FiCompass, url: '/' },
  { name: 'Favourites', icon: FiStar, url: '/' },
  { name: 'Settings', icon: FiSettings, url: '/' },
];