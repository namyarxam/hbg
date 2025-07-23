import { readDb, writeDb } from "@/lib/db";
import fs, { access } from "fs";
import path from "path";
import axios from "axios";
import { Flex, Box, Text, Image, useMediaQuery } from "@chakra-ui/react";
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
              bgImage="url(/img/gold.png)"
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
                      backgroundPosition="center"
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
  const db = await readDb();
  let { accessToken, refreshToken, expiresAt } = db.twitchAuth;
  const now = Math.floor(Date.now() / 1000) - 600;

  const refreshAccessToken = async (): Promise<string> => {
    const { data } = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: process.env.TWITCH_CLIENT_ID!,
          client_secret: process.env.TWITCH_SECRET!,
        },
      }
    );

    const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token;
    const expiresIn = data.expires_in;

    db.twitchAuth = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: now + expiresIn,
    };
    await writeDb(db);

    return newAccessToken;
  };

  if (now >= expiresAt) {
    accessToken = await refreshAccessToken();
  }

  const getTwitchData = async (token: string) => {
    try {
      const { data: response } = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
          params: {
            user_login: memberTwitchLogins,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Client-Id": process.env.TWITCH_CLIENT_ID!,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Access token expired during this request, refresh and retry once
        accessToken = await refreshAccessToken();
        return getTwitchData(accessToken);
      }
      console.error("Twitch API error:", err.message);
      return [];
    }
  };

  const getUserProfiles = async (accessToken: string, logins: string[]) => {
    try {
      const { data } = await axios.get("https://api.twitch.tv/helix/users", {
        params: { login: logins },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID!,
        },
      });
      return data.data;
    } catch (err: any) {
      console.error("Twitch User API error:", err.message);
      return [];
    }
  };

  const liveData = await getTwitchData(accessToken);
  const liveChannels = liveData.map((streamData: any) => streamData.user_login);

  // promote live members to top
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
