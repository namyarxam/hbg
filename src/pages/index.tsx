import { Flex, Box, Text, Image, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSideProps } from "next";
import { FaTwitter, FaDiscord, FaCircle } from "react-icons/fa";
import Link from "next/link";
import { Member } from "../types/Member";
import { shuffle } from "../utils/shuffle";

const Index = ({ liveData, liveChannels, profileImages, members }) => {
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");
  const [isSmallerThan480] = useMediaQuery("(max-width: 480px)");

  return (
    <>
      <Box>
        <Flex backgroundImage="url(/img/blackstone.jpg)" backgroundSize="50px">
          <Box
            m="auto"
            width="95%"
            p="22px"
            zIndex="0"
            borderRadius="8px"
            textAlign="center"
          >
            <Image
              objectFit={isSmallerThan768 ? "cover" : "inherit"}
              width="700px"
              minHeight="150px"
              borderRadius="8px"
              border="2px solid black"
              src="/img/hbg_banner.jpeg"
              margin="auto"
            />
            <Text
              mt="35px"
              mb="-25px"
              fontFamily="minecraft"
              fontSize="60px"
              color="white"
              lineHeight="normal"
              bgImage="url(/img/endstone.png)"
              bgSize="25px"
              sx={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {isSmallerThan480 ? "HBG" : "HBG MCSR"}
            </Text>
            <Box display="flex" justifyContent="center">
              <FaTwitter
                onClick={() => {
                  window.open("https://twitter.com/hbg_mc");
                }}
                cursor="pointer"
                size={32}
                style={{ margin: "10px" }}
                color="#1DA1F2"
              />
              <FaDiscord
                onClick={() => {
                  window.open("https://discord.com/invite/zwhfSEwPnw");
                }}
                cursor="pointer"
                size={32}
                style={{ margin: "10px" }}
                color="#5865F2"
              />
            </Box>
          </Box>
        </Flex>
        <Box
          backgroundImage="url(/img/netherbrick.jpg)"
          backgroundSize="50px"
          pb="24px"
        >
          {/* <Image m="auto" p="3em" src="/img/members.png" /> */}
          <Flex
            m="auto"
            pt="36px"
            maxWidth="800px"
            flexWrap="wrap"
            justifyContent="center"
          >
            {liveData.map((member: Member) => {
              const isLive =
                liveChannels.findIndex(
                  (channel: string) => channel === member.twitch
                ) >= 0;
              return (
                <Box key={member.name} mb="2em">
                  <Box textAlign="center">
                    <Text
                      fontFamily="minecraft"
                      fontWeight="bold"
                      color="white"
                      lineHeight="normal"
                      bgImage="url(/img/lava.png)"
                      bgSize="50px"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {member.name}
                    </Text>
                  </Box>
                  <Link href={`/member/${member.name.toLowerCase()}`}>
                    <Box
                      cursor="pointer"
                      textAlign="center"
                      backgroundImage={
                        profileImages[member.twitch]
                          ? `url(${profileImages[member.twitch]})`
                          : undefined
                      }
                      backgroundSize="cover"
                      p=".5em"
                      m="0em 1em"
                      borderRadius="1em"
                      border={isLive ? "2px solid red" : "1px solid lightgray"}
                      width="8em"
                      height="7em"
                      _hover={{
                        boxShadow: "-4px 4px 10px black",
                      }}
                    >
                      {isLive && (
                        <FaCircle style={{ float: "right" }} color="red" />
                      )}
                    </Box>
                  </Link>
                </Box>
              );
            })}
          </Flex>
        </Box>
        <Box
          as="footer"
          mx="auto"
          width="100%"
          py="5"
          px={{ base: "4", md: "8" }}
          backgroundImage="url(/img/mossy.jpg)"
          backgroundSize="50px"
        ></Box>
      </Box>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.host?.startsWith("localhost")
    ? "http"
    : "https";
  const host = context.req.headers.host;
  const res = await fetch(`${protocol}://${host}/api/members`);
  const members = await res.json();

  const memberTwitchLogins = members.map((member) => member.twitch);

  const handleTokenExpired = async (): Promise<string> => {
    const { data } = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: process.env.TWITCH_REFRESH_TOKEN!,
          client_id: process.env.TWITCH_CLIENT_ID!,
          client_secret: process.env.TWITCH_SECRET!,
        },
      }
    );

    return data.access_token;
  };

  const getTwitchData = async (accessToken: string): Promise<any[]> => {
    try {
      const { data: response } = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
          params: {
            user_login: memberTwitchLogins,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "client-id": process.env.TWITCH_CLIENT_ID!,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        const newAccessToken = await handleTokenExpired();
        return getTwitchData(newAccessToken);
      }
      console.error("Twitch API error:", err.message);
      return [];
    }
  };

  const getUserProfiles = async (accessToken: string, logins: string[]) => {
    const { data } = await axios.get("https://api.twitch.tv/helix/users", {
      params: { login: logins },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID!,
      },
    });

    return data.data;
  };

  const accessToken = process.env.TWITCH_ACCESS_TOKEN!;

  const liveData = await getTwitchData(accessToken);
  const liveChannels = liveData.map((streamData: any) => streamData.user_login);
  const promote = (members: Member[]): Member[] => {
    const live = members.filter((m) => liveChannels.includes(m.twitch));
    const offline = members.filter((m) => !liveChannels.includes(m.twitch));

    const shuffledLive = shuffle(live);
    const shuffledOffline = shuffle(offline);

    return [...shuffledLive, ...shuffledOffline];
  };

  const membersLiveSorted = promote(members);

  const userProfiles = await getUserProfiles(accessToken, memberTwitchLogins);

  const profileImages: Record<string, string> = {};
  userProfiles.forEach((user) => {
    profileImages[user.login] = user.profile_image_url;
  });

  return {
    props: {
      liveData: membersLiveSorted,
      liveChannels,
      profileImages,
      members,
    },
  };
};
