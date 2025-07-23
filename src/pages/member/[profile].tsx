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
import {
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaStopwatch,
  FaPalette,
} from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { TwitchEmbed, TwitchChat } from "react-twitch-embed";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ImageCarousel } from "@/components/ImageCarousel";

const Profile = ({ member }) => {
  const router = useRouter();

  const [chatVisible, setChatVisible] = useState(false);
  const [artVisibile, setArtVisible] = useState(false);

  const [isSmallerThan888] = useMediaQuery("(max-width: 888px)");

  return (
    <Box>
      <Box
        border="1px solid grey"
        m="auto"
        width="80%"
        minHeight="90vh"
        maxHeight="90vh"
        overflowY="auto"
        pos="relative"
        top="5vh"
        display={artVisibile ? "flex" : "inherit"}
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Flex height="18em" justifyContent="center" marginTop="2em">
            <Box>
              <Box position="absolute" cursor="pointer" left="25px" top="25px">
                <Box
                  as="button"
                  onClick={() => router.push("/")}
                  _hover={{ color: "#63B3ED" }}
                  transition="color 0.2s"
                  color="white"
                >
                  <AiOutlineHome size={32} />
                </Box>
              </Box>
              {artVisibile ? (
                <Box
                  position="absolute"
                  cursor="pointer"
                  right="25px"
                  top="25px"
                >
                  <Box
                    as="button"
                    onClick={() => setArtVisible(false)}
                    _hover={{ color: "#63B3ED" }}
                    transition="color 0.2s"
                    color="white"
                  >
                    <IoShareSocialSharp size={32} />
                  </Box>
                </Box>
              ) : (
                <Box
                  position="absolute"
                  cursor="pointer"
                  right="25px"
                  top="25px"
                >
                  <Box
                    as="button"
                    onClick={() => setArtVisible(true)}
                    _hover={{ color: "#63B3ED" }}
                    transition="color 0.2s"
                    color="white"
                  >
                    <FaPalette size={32} />
                  </Box>
                </Box>
              )}
            </Box>

            <Center>
              {artVisibile ? (
                <>
                  {member.art.length > 0 ? (
                    <Box>
                      <ImageCarousel images={member.art} />
                    </Box>
                  ) : (
                    <Box>
                      <Text color="white">No images yet</Text>{" "}
                    </Box>
                  )}
                </>
              ) : (
                <Box>
                  {member.mcuuid && (
                    <Box>
                      <Image
                        pt="2em"
                        m="auto"
                        width="5em"
                        src={`https://crafatar.com/avatars/${member.mcuuid}.png`}
                      />
                    </Box>
                  )}
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
                  <Flex alignItems="center">
                    <Flex alignItems="center" p="5px">
                      <Link
                        color="white"
                        ml="0.5em"
                        href={member.youtube}
                        isExternal
                        pb="2px"
                        borderBottom="2px solid transparent"
                        _hover={{ borderBottom: "2px solid white" }}
                      >
                        <FaYoutube size={22} color="#c4302b" />
                      </Link>
                    </Flex>
                    <Flex alignItems="center" p="5px">
                      <Link
                        color="white"
                        ml="0.5em"
                        href={`https://twitter.com/${member.twitter}`}
                        isExternal
                        pb="2px"
                        borderBottom="2px solid transparent"
                        _hover={{ borderBottom: "2px solid white" }}
                      >
                        <FaTwitter size={22} color="#1DA1F2" />
                      </Link>
                    </Flex>
                    <Flex alignItems="center" p="5px">
                      <Link
                        color="white"
                        ml="0.5em"
                        href={`https://www.twitch.tv/${member.twitch}`}
                        isExternal
                        pb="2px"
                        borderBottom="2px solid transparent"
                        _hover={{ borderBottom: "2px solid white" }}
                      >
                        <FaTwitch size={22} color="#6441a5" />
                      </Link>
                    </Flex>
                    {member.sr && (
                      <Flex alignItems="center" p="5px">
                        <Link
                          color="white"
                          ml="0.5em"
                          href={`https://www.speedrun.com/user/${member.sr}`}
                          isExternal
                          pb="2px"
                          borderBottom="2px solid transparent"
                          _hover={{ borderBottom: "2px solid white" }}
                        >
                          <FaStopwatch size={22} color="#189D76" />
                        </Link>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              )}
            </Center>
          </Flex>
        </Box>
        {!artVisibile && (
          <Box mb="2em">
            <Flex>
              <Box m="auto" width={isSmallerThan888 ? "100%" : "75%"}>
                <TwitchEmbed
                  width="100%"
                  height={isSmallerThan888 ? "50vw" : "30vw"}
                  withChat={false}
                  channel={member.twitch}
                  theme="dark"
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
        )}
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
