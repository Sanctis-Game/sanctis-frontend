import { IconButton, Link } from "@chakra-ui/react";
import { BiHelpCircle } from "react-icons/bi";

const DocumentationButton: React.FC<{ href: string }> = ({ href }) => {
  return (
    <IconButton
      as={Link}
      href={href}
      target="_blank"
      icon={<BiHelpCircle />}
      aria-label="See the docs"
      w="48px"
      rounded="full"
    />
  );
};

export default DocumentationButton;
