import React from "react";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";

// if not found, piglin brute
//
//
//
// mc faces?

interface profileProps {}

const Profile: React.FC<profileProps> = ({}) => {
  const router = useRouter();

  return (
    <>
      <Box height="15em" backgroundImage="url(/img/blackstone.jpg)"></Box>
    </>
  );
};

export default Profile;
