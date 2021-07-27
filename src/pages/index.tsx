import { Flex, Box, Text, Image } from "@chakra-ui/react";
import { memberList } from "../data/memberList";
import MediaButtons from "../components/MediaButtons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { FaTwitter, FaCircle } from "react-icons/fa";

const Index = ({ liveData }) => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.replace(router.asPath, null, {
        scroll: false,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const liveChannels = liveData.map((streamData: any) => {
    return streamData.user_login;
  });

  return (
    <>
      <Box height="5em" backgroundImage="url(/img/dirt4.jpg)"></Box>
      <Flex backgroundImage="url(/img/dirt3.jpg)">
        <Box
          m="auto"
          width="95%"
          p="22px"
          zIndex="0"
          borderRadius="8px"
          textAlign="center"
        >
          <Image
            borderRadius="8px"
            border="2px solid black"
            src="/img/hbg_banner.jpeg"
          />
          <Image
            m="auto"
            mt="3em"
            pb="1.5em"
            src="/img/HOUSE_BUILDER_GANG.png"
          />
          <Box>
            <FaTwitter
              onClick={() => {
                window.open("https://twitter.com/hbg_mc");
              }}
              cursor="pointer"
              size={32}
              style={{ margin: "auto" }}
              color="#1DA1F2"
            />
          </Box>
        </Box>
      </Flex>
      <Box backgroundImage="url(/img/stone4.jpg)" pb="2em">
        {/* <Text pt="1em" ml="1em" fontSize="30px">
          Members
        </Text> */}
        <Image m="auto" p="3em" src="/img/members.png" />
        <Flex flexWrap="wrap" justifyContent="center">
          {memberList.map((member) => {
            const isLive =
              liveChannels.findIndex(
                (channel: any) => channel === member.twitch
              ) >= 0;
            return (
              <Box key={member.name} mb="2em">
                <Box textAlign="center">
                  <Text
                    fontFamily="copperplate"
                    fontWeight="bold"
                    color="white"
                  >
                    {member.name}
                  </Text>
                </Box>
                <Box
                  textAlign="center"
                  backgroundImage={`/img/avatars/${member.twitter}.jpg`}
                  backgroundSize="cover"
                  p=".5em"
                  m="0em 1em"
                  borderRadius="1em"
                  border={isLive ? "2px solid red" : "1px solid lightgray"}
                  width="8em"
                  height="7em"
                >
                  {isLive && (
                    <FaCircle style={{ float: "right" }} color="red" />
                  )}
                </Box>
                <Box>
                  <MediaButtons
                    twitter={member.twitter}
                    youtube={member.youtube}
                    twitch={member.twitch}
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Box>
      <Box
        as="footer"
        mx="auto"
        width="100%"
        py="12"
        px={{ base: "4", md: "8" }}
        backgroundImage="url(/img/mossy.jpg)"
      ></Box>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const memberTwitchLogins = memberList.map((member) => {
    return member.twitch;
  });

  const getTwitchData = async (accessToken: any) => {
    try {
      const { data: response } = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
          params: {
            user_login: memberTwitchLogins,
          },
          headers: {
            Authorization: "Bearer " + accessToken,
            ["client-id"]: process.env.TWITCH_CLIENT_ID,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.log("err", err);
      // call handleTokenExpired if caught
    }
  };

  const handleTokenExpired = async () => {
    await axios
      .post("https://id.twitch.tv/oauth2/token", {
        params: {
          grant_type: "refresh_token",
          refresh_token: "Vgq8U7Iq32kuiawKyYss",
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_SECRET,
        },
      })
      .then((response: any) => {
        getTwitchData(response.accessToken);
      });
  };

  const liveData = await getTwitchData("yk81a0a27h7j4m7aqxh9mgt5uvm750");

  return {
    props: {
      liveData,
    },
  };
};
