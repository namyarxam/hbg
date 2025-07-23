import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
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
} from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/router";

type Member = {
  name: string;
  twitter?: string;
  youtube?: string;
  twitch?: string;
  uuid: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

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
    uuid: "",
    twitter: "",
    youtube: "",
    twitch: "",
  });

  function handlePasswordSubmit() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchMembers();
    } else {
      toast({
        title: "Incorrect password",
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
        body: JSON.stringify({ uuid: memberToDelete.uuid }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({
        title: `Deleted ${memberToDelete.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setMembers((prev) => prev.filter((m) => m.uuid !== memberToDelete.uuid));
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

  async function handleAddMember() {
    const { name } = newMember;
    if (!name) {
      toast({
        title: "Name is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
        uuid: "",
        twitter: "",
        youtube: "",
        twitch: "",
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
      <Box position="absolute" top="30px" left="30px">
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
            Admin Panel
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
                key={member.uuid}
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
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>UUID</FormLabel>
                  <Input
                    value={newMember.uuid}
                    onChange={(e) =>
                      setNewMember({ ...newMember, uuid: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Twitter</FormLabel>
                  <Input
                    value={newMember.twitter}
                    onChange={(e) =>
                      setNewMember({ ...newMember, twitter: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>YouTube</FormLabel>
                  <Input
                    value={newMember.youtube}
                    onChange={(e) =>
                      setNewMember({ ...newMember, youtube: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Twitch</FormLabel>
                  <Input
                    value={newMember.twitch}
                    onChange={(e) =>
                      setNewMember({ ...newMember, twitch: e.target.value })
                    }
                  />
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
