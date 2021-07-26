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
    <Flex>
      <Box
        _hover={{
          borderBottom: "1px solid black",
        }}
      >
        <FaTwitter color="#1DA1F2" />
      </Box>
      <Box
        _hover={{
          borderBottom: "1px solid black",
        }}
      >
        <FaYoutube color="#c4302b" />
      </Box>
      <Box
        _hover={{
          borderBottom: "1px solid black",
        }}
      >
        <FaTwitch color="#6441a5" />
      </Box>
    </Flex>
  );
};

export default MediaButtons;
