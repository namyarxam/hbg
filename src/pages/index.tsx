import {
  Flex,
  Box,
  Text,
  Wrap,
  WrapItem,
  Avatar,
  Image,
} from "@chakra-ui/react";
import { memberList } from "../data/memberList";
import { useState } from "react";
import MediaButtons from "../components/MediaButtons";

const Index = () => {
  const [hovers, setHovers] = useState({});

  return (
    <>
      <Flex
        backgroundImage="url(/img/stone3.jpg)"
        borderBottom="1px solid lightgray"
      >
        <Box
          m="auto"
          width="95%"
          p="32px"
          zIndex="0"
          borderRadius="8px"
          textAlign="center"
        >
          <Image
            borderRadius="8px"
            border="2px solid black"
            src="/img/hbg_banner.jpeg"
          />
          <Image m="auto" mt="1.5em" width="10em" src="/img/hbg1.png" />
          <Text fontWeight="bold" fontSize="20px" mt="1em">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
        </Box>
      </Flex>
      <Box>
        <Box>
          <Wrap className="whereami">
            {memberList.map((member) => {
              return (
                <WrapItem key={member.name}>
                  <Box
                    textAlign="center"
                    backgroundColor="#F7FAFC"
                    p=".5em"
                    m=".5em"
                    borderRadius="1em"
                    border="1px solid lightgray"
                    width="8em"
                  >
                    <Text>{member.name}</Text>
                    <Avatar
                      name={member.name}
                      src={`/img/avatars/${member.twitter}.jpg`}
                    />
                    <MediaButtons
                      twitter={member.twitter}
                      youtube={member.youtube}
                      twitch={member.twitch}
                    />
                  </Box>
                </WrapItem>
              );
            })}
          </Wrap>
        </Box>
      </Box>
    </>
  );
};

export default Index;
