import React, { useState } from "react";
import {
  Box,
  Image,
  Flex,
  Text,
  Link,
  Center,
  Img,
  Button,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { memberList } from "../../data/memberList";
import axios from "axios";
import { FaTwitter, FaYoutube, FaTwitch, FaStopwatch } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TwitchEmbed, TwitchChat } from "react-twitch-embed";
import { useRouter } from "next/router";

// if not found, piglin brute

// loading screen

interface profileProps {
  memberInfo: {
    name: string;
    twitter: string;
    youtube: string;
    twitch: string;
    uuid: string;
  };
}

const Profile: React.FC<profileProps> = ({ memberInfo }) => {
  const router = useRouter();

  const [chatVisible, setChatVisible] = useState(false);

  return (
    <Box>
      <Box
        border="1px solid grey"
        m="auto"
        width="80%"
        pos="relative"
        top="5vh"
      >
        <Box>
          <Flex>
            <Box p="2vw">
              <Box cursor="pointer">
                <AiOutlineHome
                  onClick={() => {
                    router.push("/");
                  }}
                  size={32}
                />
              </Box>
            </Box>
            <Img
              ml="8vw"
              p="25px"
              fallbackSrc="/img/Alex.png"
              src={`https://crafatar.com/renders/body/${memberInfo.uuid}.png`}
            />
            <Center>
              <Box>
                <Text fontSize="35px" fontWeight="bold" mb="0.5em">
                  {memberInfo.name}
                </Text>
                <Flex alignItems="center">
                  <FaYoutube color="#c4302b" />
                  <Link ml="0.5em" href={memberInfo.youtube} isExternal>
                    {memberInfo.name} <ExternalLinkIcon mx="2px" />
                  </Link>
                </Flex>
                <Flex alignItems="center">
                  <FaTwitter color="#1DA1F2" />
                  <Link
                    ml="0.5em"
                    href={`https://twitter.com/${memberInfo.twitter}`}
                    isExternal
                  >
                    @{memberInfo.twitter} <ExternalLinkIcon mx="2px" />
                  </Link>
                </Flex>
                <Flex alignItems="center">
                  <FaTwitch color="#6441a5" />
                  <Link
                    ml="0.5em"
                    href={`https://www.twitch.tv/${memberInfo.twitch}`}
                    isExternal
                  >
                    {memberInfo.twitch} <ExternalLinkIcon mx="2px" />
                  </Link>
                </Flex>
                <Flex alignItems="center">
                  <FaStopwatch color="#189D76" />
                  <Link
                    ml="0.5em"
                    href={`https://www.speedrun.com/user/${memberInfo.name}`}
                    isExternal
                  >
                    {memberInfo.name}'s speedruns <ExternalLinkIcon mx="2px" />
                  </Link>
                </Flex>
              </Box>
            </Center>
          </Flex>
        </Box>
        <Box mb="2em">
          <Flex>
            <Box m="auto">
              <TwitchEmbed
                width="70vw"
                height="35vh"
                withChat={false}
                channel={memberInfo.twitch}
                theme="dark"
                muted
              />

              {}

              {typeof window !== "undefined" && chatVisible ? (
                <>
                  <TwitchChat
                    style={{ margin: "auto" }}
                    width="100%"
                    height="400em"
                    channel={memberInfo.twitch}
                    theme="dark"
                  />
                  <Box textAlign="center" mt="0.5em">
                    <Button
                      onClick={() => {
                        setChatVisible(false);
                      }}
                    >
                      Hide Chat
                    </Button>
                  </Box>
                </>
              ) : (
                <Box textAlign="center" mt="0.5em">
                  <Button
                    onClick={() => {
                      setChatVisible(true);
                    }}
                  >
                    Show Chat
                  </Button>
                </Box>
              )}
            </Box>
          </Flex>
          <Image
            pt="2em"
            m="auto"
            width="6vw"
            fallbackSrc="/img/AlexHead.png"
            src={`https://crafatar.com/avatars/${memberInfo.uuid}.png`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;

export async function getStaticPaths() {
  const paths = memberList.map((member) => {
    return {
      params: {
        profile: member.name,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const memberInfo = memberList.find(
    (member) => member.name === context.params.profile
  );

  return {
    props: { memberInfo },
  };
}
