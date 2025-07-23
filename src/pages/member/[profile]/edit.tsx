import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Image,
  VStack,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function EditProfileArt() {
  const router = useRouter();
  const { profile } = router.query;
  const toast = useToast();

  const [art, setArt] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;

    async function fetchMember() {
      try {
        const res = await axios.get(`/api/members/${profile}`);
        setArt(res.data.art || []);
      } catch (error) {
        toast({
          title: "Error loading member data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    fetchMember();
  }, [profile, toast]);

  function addImage() {
    if (!newImageUrl.trim()) return;
    setArt([...art, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  function deleteImage(index: number) {
    setArt(art.filter((_, i) => i !== index));
  }

  async function saveChanges() {
    if (!password) {
      toast({
        title: "Password required",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/members/${profile}/art`, { art, password });
      toast({
        title: "Art updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update art",
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Text fontSize="2xl" mb={4}>
        Edit Art for {profile}
      </Text>

      <VStack spacing={4} align="stretch">
        {/* Password Input */}
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          color="white"
        />

        {/* Art URLs List */}
        <VStack
          spacing={2}
          align="stretch"
          maxH="300px"
          overflowY="auto"
          border="1px solid"
          borderColor="gray.300"
          p={2}
          borderRadius="md"
        >
          {art.length === 0 && <Text color="gray.500">No art images yet.</Text>}
          {art.map((url, i) => (
            <HStack key={i} spacing={4}>
              <Image
                src={url}
                alt={`Art ${i + 1}`}
                boxSize="60px"
                objectFit="cover"
                borderRadius="md"
              />
              <Text isTruncated maxW="400px">
                {url}
              </Text>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => deleteImage(i)}
              >
                Delete
              </Button>
            </HStack>
          ))}
        </VStack>

        {/* Add new image */}
        <HStack>
          <Input
            placeholder="New image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            color="white"
          />
          <Button onClick={addImage} colorScheme="blue">
            Add
          </Button>
        </HStack>

        <Button colorScheme="green" onClick={saveChanges} isLoading={loading}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
