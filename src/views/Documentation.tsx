import React from "react";
import { Container, Heading, Link, List, ListItem, Stack, useColorModeValue } from "@chakra-ui/react";

const Documentation: React.FC = () => {
  return (
    <Container maxW={"5xl"}>
      <Stack
        background={useColorModeValue("white", "gray.800")}
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        p="3"
        rounded="xl"
      >
        <Heading>Documentation and resources</Heading>
        <List>
          <ListItem>
            <Link href="https://docs.sanctis.xyz/">Official documentation</Link>
          </ListItem>
          <ListItem>
            <Link href="https://discord.gg/RzW8Eptb3g">Discord</Link>
          </ListItem>
          <ListItem>
            <Link href="https://github.com/Sanctis-Game">Github</Link>
          </ListItem>
        </List>
      </Stack>
    </Container>
  );
};

export default Documentation;
