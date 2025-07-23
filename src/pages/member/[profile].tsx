import React, { useState } from "react";
import {
  Box,
  Image,
  Flex,
  Text,
  Link,
  Center,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaTwitter, FaYoutube, FaTwitch, FaStopwatch } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TwitchEmbed, TwitchChat } from "react-twitch-embed";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const Profile = ({ member }) => {
  const router = useRouter();

  const [chatVisible, setChatVisible] = useState(false);

  const [isSmallerThan888] = useMediaQuery("(max-width: 888px)");

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
          <Flex height="18em" justifyContent="center" margin="2em">
            <Box>
              <Box position="absolute" cursor="pointer" left="25px" top="25px">
                <AiOutlineHome
                  onClick={() => {
                    router.push("/");
                  }}
                  size={32}
                  color="white"
                />
              </Box>
            </Box>

            <Center>
              <Box>
                <Box>
                  <Image
                    pt="2em"
                    m="auto"
                    width="5em"
                    src={`https://crafatar.com/avatars/${member.uuid}.png`}
                  />
                </Box>
                <Box textAlign="center">
                  <Text
                    color="white"
                    fontSize="35px"
                    fontWeight="bold"
                    mb="0.5em"
                  >
                    {member.name}
                  </Text>
                </Box>
                <Flex alignItems="center" display="inline">
                  <Flex alignItems="center" p="5px">
                    <FaYoutube size={22} color="#c4302b" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={member.youtube}
                      isExternal
                    >
                      {member.name} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                  <Flex alignItems="center" p="5px">
                    <FaTwitter size={22} color="#1DA1F2" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={`https://twitter.com/${member.twitter}`}
                      isExternal
                    >
                      @{member.twitter} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                  <Flex alignItems="center" p="5px">
                    <FaTwitch size={22} color="#6441a5" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={`https://www.twitch.tv/${member.twitch}`}
                      isExternal
                    >
                      {member.twitch} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                  <Flex alignItems="center" p="5px">
                    <FaStopwatch size={22} color="#189D76" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={`https://www.speedrun.com/user/${member.name}`}
                      isExternal
                    >
                      {member.name}'s speedruns <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                </Flex>
              </Box>
            </Center>
          </Flex>
        </Box>
        <Box mb="2em">
          <Flex>
            <Box m="auto" width={isSmallerThan888 ? "100%" : "75%"}>
              <TwitchEmbed
                width="100%"
                height={isSmallerThan888 ? "50vw" : "30vw"}
                withChat={false}
                channel={member.twitch}
                theme="dark"
                muted
              />

              {typeof window !== "undefined" && chatVisible ? (
                <>
                  <TwitchChat
                    style={{ margin: "auto" }}
                    width="100%"
                    channel={member.twitch}
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
        </Box>
      </Box>
      <Box
        as="footer"
        mx="auto"
        width="100%"
        py="12"
        px={{ base: "4", md: "8" }}
      ></Box>
    </Box>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { profile } = context.params!;

  const protocol = context.req.headers.host?.startsWith("localhost")
    ? "http"
    : "https";
  const host = context.req.headers.host;

  const res = await fetch(`${protocol}://${host}/api/members`);
  const members = await res.json();

  const member =
    members.find(
      (m: { name: string }) =>
        m.name.toLowerCase() === String(profile).toLowerCase()
    ) || null;

  return {
    props: { member },
  };
};
