import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useMediaQuery,
} from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/router";

type Member = {
  id: string;
  name: string;
  twitter: string;
  youtube: string;
  twitch: string;
  mcuuid?: string;
  sr?: string;
  art?: string[];
  password?: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSmallerThan735] = useMediaQuery("(max-width: 735px)");

  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const [newMember, setNewMember] = useState({
    name: "",
    mcuuid: "",
    twitter: "",
    youtube: "",
    twitch: "",
    sr: "",
  });

  async function handlePasswordSubmit() {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthenticated(true);
        fetchMembers();
      } else {
        toast({
          title: data.message || "Incorrect password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      toast({
        title: "Failed to load members",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!memberToDelete) return;

    try {
      const res = await fetch("/api/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memberToDelete.id }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({
        title: `Deleted ${memberToDelete.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      setMemberToDelete(null);
      onDeleteClose();
    } catch {
      toast({
        title: "Delete failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  function validateFields() {
    const errs: Record<string, string> = {};
    const { name, twitter, youtube, twitch, sr } = newMember;

    if (!name) {
      errs.name = "Name is required";
    } else if (name.length > 12) {
      errs.name = "Name must be 12 characters or fewer";
    }

    if (!twitter) {
      errs.twitter = "Twitter is required";
    } else if (
      (twitter && twitter.includes("http")) ||
      twitter.includes("www.") ||
      twitter.includes(".com")
    ) {
      errs.twitter = "Enter only the Twitter handle (no URL)";
    }

    if (!youtube) {
      errs.youtube = "Youtube is required";
    } else if (youtube && !/^https?:\/\/.+\..+/.test(youtube)) {
      errs.youtube = "Must be a valid YouTube URL";
    }

    if (!twitch) {
      errs.twitch = "Twitch is required";
    } else if (
      (twitch && twitch.includes("http")) ||
      twitch.includes("www.") ||
      twitch.includes(".com")
    ) {
      errs.twitch = "Enter only the Twitch handle (no URL)";
    }

    if (
      (sr && sr.includes("http")) ||
      sr.includes("www.") ||
      sr.includes(".com")
    ) {
      errs.twitch = "Enter only the Speedrun.com handle (no URL)";
    }

    return errs;
  }

  async function handleAddMember() {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) throw new Error("Failed to add");

      const added = await res.json();
      setMembers((prev) => [...prev, added]);
      onAddClose();
      setNewMember({
        name: "",
        mcuuid: "",
        twitter: "",
        youtube: "",
        twitch: "",
        sr: "",
      });
      toast({
        title: `Added ${added.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Add member failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  if (!authenticated) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Box p={6} rounded="md" shadow="md" minWidth="320px">
          <Text mb={4} fontSize="xl" fontWeight="bold" color="white">
            Enter Admin Password
          </Text>
          <Input
            type="password"
            placeholder="Password"
            color="white"
            value={password}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePasswordSubmit();
              }
            }}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
          />
          <Button
            colorScheme="blue"
            onClick={handlePasswordSubmit}
            width="full"
          >
            Submit
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <Box
        position={isSmallerThan735 ? "relative" : "absolute"}
        top={isSmallerThan735 ? "5px" : "30px"}
        left={isSmallerThan735 ? "5px" : "30px"}
      >
        <AiOutlineHome
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
          size={32}
          color="white"
        />
      </Box>
      <Box p={6} maxWidth="600px" mx="auto">
        <Flex justify="space-between" mb={6} align="center">
          <Text color="white" fontSize="2xl" fontWeight="bold">
            HBG Admin
          </Text>
          <Button colorScheme="green" onClick={onAddOpen}>
            Add New Member
          </Button>
        </Flex>

        {loading ? (
          <Text>Loading members...</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {members.length === 0 && <Text>No members found.</Text>}
            {members.map((member) => (
              <Flex
                key={member.mcuuid}
                justify="space-between"
                align="center"
                p={3}
                bg="gray.100"
                rounded="md"
              >
                <Box>
                  <Text fontWeight="bold">{member.name}</Text>
                </Box>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setMemberToDelete(member);
                    onDeleteOpen();
                  }}
                >
                  Delete
                </Button>
              </Flex>
            ))}
          </VStack>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                {memberToDelete?.name}
              </Text>
              ?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Member Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Member</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                  />
                  <FormHelperText>Max 12 characters</FormHelperText>
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.twitter}>
                  <FormLabel>Twitter</FormLabel>
                  <Input
                    value={newMember.twitter}
                    onChange={(e) =>
                      setNewMember({ ...newMember, twitter: e.target.value })
                    }
                  />
                  <FormHelperText>Just the handle, no URL</FormHelperText>
                  <FormErrorMessage>{errors.twitter}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.youtube}>
                  <FormLabel>YouTube</FormLabel>
                  <Input
                    value={newMember.youtube}
                    onChange={(e) =>
                      setNewMember({ ...newMember, youtube: e.target.value })
                    }
                  />
                  <FormHelperText>Must be a valid URL</FormHelperText>
                  <FormErrorMessage>{errors.youtube}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.twitch}>
                  <FormLabel>Twitch</FormLabel>
                  <Input
                    value={newMember.twitch}
                    onChange={(e) =>
                      setNewMember({ ...newMember, twitch: e.target.value })
                    }
                  />
                  <FormHelperText>Just the handle, no URL</FormHelperText>
                  <FormErrorMessage>{errors.twitch}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.sr}>
                  <FormLabel>Speedrun.com Name</FormLabel>
                  <Input
                    value={newMember.sr}
                    onChange={(e) =>
                      setNewMember({ ...newMember, sr: e.target.value })
                    }
                  />
                  <FormHelperText>Just the handle, no URL</FormHelperText>
                  <FormErrorMessage>{errors.sr}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Minecraft UUID</FormLabel>
                  <Input
                    value={newMember.mcuuid}
                    onChange={(e) =>
                      setNewMember({ ...newMember, mcuuid: e.target.value })
                    }
                  />
                  <FormHelperText>
                    You can find this by entering your username at
                    <Link
                      color="blue"
                      href="https://mcuuid.net/"
                      target="_blank"
                    >
                      {" "}
                      https://mcuuid.net/
                    </Link>
                  </FormHelperText>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleAddMember}>
                Add Member
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
