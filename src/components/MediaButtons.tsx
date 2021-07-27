import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaTwitch } from "react-icons/fa";

interface MediaButtonsProps {
  twitter: string;
  youtube: string;
  twitch: string;
}

const MediaButtons: React.FC<MediaButtonsProps> = ({
  twitter,
  youtube,
  twitch,
}) => {
  return (
    <Flex p="5px" mt="5px" justifyContent="center" cursor="pointer">
      <Box
        onClick={() => {
          window.open(`https://twitter.com/${twitter}`);
        }}
        mr="10%"
      >
        <FaTwitter color="#1DA1F2" />
      </Box>
      <Box
        onClick={() => {
          window.open(youtube);
        }}
      >
        <FaYoutube color="#c4302b" />
      </Box>
      <Box
        onClick={() => {
          window.open(`https://www.twitch.tv/${twitch}`);
        }}
        ml="10%"
      >
        <FaTwitch color="#6441a5" />
      </Box>
    </Flex>
  );
};

export default MediaButtons;
