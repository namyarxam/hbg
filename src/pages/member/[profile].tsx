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
import { memberList } from "../../data/memberList";
import axios from "axios";
import { FaTwitter, FaYoutube, FaTwitch, FaStopwatch } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TwitchEmbed, TwitchChat } from "react-twitch-embed";
import { useRouter } from "next/router";
import { Run } from "../../types/PersonalBests";
import { getOrdinalNum } from "../../utils/getOrdinalNum";

interface profileProps {
  memberInfo: {
    name: string;
    twitter: string;
    youtube: string;
    twitch: string;
    uuid: string;
  };
  speedruns: {
    icarus: { place: string; time: string; video: string };
    ssg: { place: string; time: string; video: string };
    fsg: { place: string; time: string; video: string };
    rsg: { place: string; time: string; video: string };
  };
}

const Profile: React.FC<profileProps> = ({ memberInfo, speedruns }) => {
  const router = useRouter();

  const [chatVisible, setChatVisible] = useState(false);

  const [isSmallerThan888] = useMediaQuery("(max-width: 888px)");
  const [isSmallerThan700] = useMediaQuery("(max-width: 700px)");

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
                    fallbackSrc="/img/AlexHead.png"
                    src={`https://crafatar.com/avatars/${memberInfo.uuid}.png`}
                  />
                </Box>
                <Box textAlign="center">
                  <Text
                    color="white"
                    fontSize="35px"
                    fontWeight="bold"
                    mb="0.5em"
                  >
                    {memberInfo.name}
                  </Text>
                </Box>
                <Flex
                  alignItems="center"
                  display={isSmallerThan888 ? "inline" : "flex"}
                >
                  <Flex alignItems="center" p="5px">
                    <FaYoutube size={22} color="#c4302b" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={memberInfo.youtube}
                      isExternal
                    >
                      {memberInfo.name} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                  <Flex alignItems="center" p="5px">
                    <FaTwitter size={22} color="#1DA1F2" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={`https://twitter.com/${memberInfo.twitter}`}
                      isExternal
                    >
                      @{memberInfo.twitter} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                  <Flex alignItems="center" p="5px">
                    <FaTwitch size={22} color="#6441a5" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={`https://www.twitch.tv/${memberInfo.twitch}`}
                      isExternal
                    >
                      {memberInfo.twitch} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                  <Flex alignItems="center" p="5px">
                    <FaStopwatch size={22} color="#189D76" />
                    <Link
                      color="white"
                      ml="0.5em"
                      href={`https://www.speedrun.com/user/${memberInfo.name}`}
                      isExternal
                    >
                      {memberInfo.name}'s speedruns{" "}
                      <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Flex>
                </Flex>
              </Box>
            </Center>
          </Flex>
        </Box>
        <Box mb="2em">
          <Flex>
            <Box m="auto">
              <TwitchEmbed
                width={isSmallerThan888 ? "78vw" : "53.3vw"}
                height={isSmallerThan888 ? "50vw" : "30vw"}
                withChat={false}
                channel={memberInfo.twitch}
                theme="dark"
                muted
              />

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
          {speedruns && (
            <>
              <Box textAlign="center" mt="2em">
                <Text
                  color="white"
                  fontSize="35px"
                  fontWeight="bold"
                  mb="0.5em"
                >
                  Speedruns
                </Text>
              </Box>
              <Flex justifyContent="center">
                <Box textColor="white">
                  {speedruns.icarus.time && (
                    <Flex
                      textAlign="center"
                      p={isSmallerThan700 ? "1em" : null}
                    >
                      <Text
                        position="absolute"
                        left={0}
                        right={0}
                        ml="auto"
                        mr="auto"
                        width="100px"
                        textAlign="center"
                        color="yellow"
                        fontWeight="bold"
                      >
                        - {speedruns.icarus.place} -
                      </Text>
                      <Image
                        width="4em"
                        height="4em"
                        src="/img/Block_Rocket.png"
                      />
                      <Text
                        m="auto"
                        p="1em"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          window.open(speedruns.icarus.video);
                        }}
                      >
                        <b>[ Icarus Any% RSG, 1.16 ]</b> -{" "}
                        {speedruns.icarus.time} <ExternalLinkIcon mb="5px" />
                      </Text>
                      <Image
                        width="4em"
                        height="4em"
                        src="/img/Block_Grass.png"
                      />
                    </Flex>
                  )}
                  {speedruns.ssg.time && (
                    <Flex
                      textAlign="center"
                      p={isSmallerThan700 ? "1em" : null}
                    >
                      <Text
                        position="absolute"
                        left={0}
                        right={0}
                        ml="auto"
                        mr="auto"
                        width="100px"
                        textAlign="center"
                        color="yellow"
                        fontWeight="bold"
                      >
                        - {speedruns.ssg.place} -
                      </Text>
                      <Image
                        width="4em"
                        height="4em"
                        src="/img/Block_Flint.png"
                      />
                      <Text
                        m="auto"
                        p="1em"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          window.open(speedruns.ssg.video);
                        }}
                      >
                        <b>[ SSG Any%, 1.16 ]</b> - {speedruns.ssg.time}{" "}
                        <ExternalLinkIcon mb="5px" />
                      </Text>
                      <Image
                        width="4em"
                        height="4em"
                        src="/img/Block_Gravel.png"
                      />
                    </Flex>
                  )}
                  {speedruns.fsg.time && (
                    <Flex
                      textAlign="center"
                      p={isSmallerThan700 ? "1em" : null}
                    >
                      <Text
                        position="absolute"
                        left={0}
                        right={0}
                        ml="auto"
                        mr="auto"
                        width="100px"
                        textAlign="center"
                        color="yellow"
                        fontWeight="bold"
                      >
                        - {speedruns.fsg.place} -
                      </Text>
                      <Image width="4em" height="4em" src="/img/Block_GI.png" />
                      <Text
                        m="auto"
                        p="1em"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          window.open(speedruns.fsg.video);
                        }}
                      >
                        <b>[ FSG Any%, 1.16 ]</b> - {speedruns.fsg.time}{" "}
                        <ExternalLinkIcon mb="5px" />
                      </Text>
                      <Image width="4em" height="4em" src="/img/Block_BS.png" />
                    </Flex>
                  )}
                  {speedruns.rsg.time && (
                    <Flex
                      textAlign="center"
                      p={isSmallerThan700 ? "1em" : null}
                    >
                      <Text
                        position="absolute"
                        left={0}
                        right={0}
                        ml="auto"
                        mr="auto"
                        width="100px"
                        textAlign="center"
                        color="yellow"
                        fontWeight="bold"
                      >
                        - {speedruns.rsg.place} -
                      </Text>
                      <Image width="4em" height="4em" src="/img/Block_BR.png" />
                      <Text
                        m="auto"
                        p="1em"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          window.open(speedruns.rsg.video);
                        }}
                      >
                        <b>[ RSG Any%, 1.16+ ]</b> - {speedruns.rsg.time}{" "}
                        <ExternalLinkIcon mb="5px" />
                      </Text>
                      <Image width="4em" height="4em" src="/img/Block_NB.png" />
                    </Flex>
                  )}
                </Box>
              </Flex>
            </>
          )}
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

  const getSpeedrunData = async () => {
    try {
      const { data: response } = await axios.get(
        `https://www.speedrun.com/api/v1/users/${memberInfo.name}/personal-bests`
      );

      return response.data;
    } catch (err) {
      console.log("err", err);
      return null;
    }
  };

  const getFormattedSpeedrunData = async () => {
    const srData = await getSpeedrunData();

    if (!srData) return null;

    const relevantRunData = Object.values(srData).filter(
      (speedrun: Run) =>
        speedrun.run.values["jlzwd77l"] == "xqkj8kdl" ||
        (speedrun.run.values["jlzkwql2"] == "mln68v0q" &&
          speedrun.run.values["r8rg67rn"] == "klrzpjo1") ||
        (speedrun.run.values["jlzwkmql"] == "5lmj45jl" &&
          speedrun.run.values["ql61eov8"] == "81pvroe1") ||
        (speedrun.run.values["jlzkwql2"] == "mln68v0q" &&
          speedrun.run.values["r8rg67rn"] == "21d4zvp1")
    );

    const icarus = relevantRunData.find(
      (data: Run) => data.run.values["jlzwd77l"] == "xqkj8kdl"
    ) as Run;
    const ssg = relevantRunData.find(
      (data: Run) =>
        data.run.values["jlzkwql2"] == "mln68v0q" &&
        data.run.values["r8rg67rn"] == "klrzpjo1"
    ) as Run;
    const fsg = relevantRunData.find(
      (data: Run) =>
        data.run.values["jlzwkmql"] == "5lmj45jl" &&
        data.run.values["ql61eov8"] == "81pvroe1"
    ) as Run;
    const rsg = relevantRunData.find(
      (data: Run) =>
        data.run.values["jlzkwql2"] == "mln68v0q" &&
        data.run.values["r8rg67rn"] == "21d4zvp1"
    ) as Run;

    const formatTime = (timeNum: number) => {
      const m = Math.floor(timeNum / 60);
      const s = (timeNum - m * 60).toFixed(2);

      return `${m}m ${s}s `;
    };

    return {
      icarus: {
        place: icarus?.place ? getOrdinalNum(icarus.place) : null,
        time: icarus?.run ? formatTime(icarus.run.times.primary_t) : null,
        video: icarus?.run.videos.links[0].uri || null,
      },
      ssg: {
        place: ssg?.place ? getOrdinalNum(ssg.place) : null,
        time: ssg?.run ? formatTime(ssg.run.times.primary_t) : null,
        video: ssg?.run.videos.links[0].uri || null,
      },
      fsg: {
        place: fsg?.place ? getOrdinalNum(fsg.place) : null,
        time: fsg?.run ? formatTime(fsg.run.times.primary_t) : null,
        video: fsg?.run.videos.links[0].uri || null,
      },
      rsg: {
        place: rsg?.place ? getOrdinalNum(rsg.place) : null,
        time: rsg?.run ? formatTime(rsg.run.times.primary_t) : null,
        video: rsg?.run.videos.links[0].uri || null,
      },
    };
  };

  const formattedRunData = await getFormattedSpeedrunData();

  return {
    props: { memberInfo, speedruns: formattedRunData },
  };
}
