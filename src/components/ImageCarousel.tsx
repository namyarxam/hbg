import {
  Box,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
  });

  const modalSwipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    onSwipedDown: onClose,
    trackTouch: true,
  });

  // @ts-ignore
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="full"
        position="relative"
        {...handlers}
      >
        {/* Left Arrow */}
        <IconButton
          aria-label="Previous image"
          icon={<ChevronLeftIcon />}
          onClick={prevImage}
          variant="ghost"
          colorScheme="whiteAlpha"
          fontSize="4xl"
          boxSize="60px"
          mr={[1, 2, 4]}
        />

        {/* Image */}
        <Box flex="1" maxW="100%" cursor="pointer" onClick={onOpen}>
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width="100%"
            height={["200px", "300px", "500px"]}
            objectFit="cover"
            borderRadius="md"
            loading="lazy"
          />
        </Box>

        {/* Right Arrow */}
        <IconButton
          aria-label="Next image"
          icon={<ChevronRightIcon />}
          onClick={nextImage}
          variant="ghost"
          colorScheme="whiteAlpha"
          fontSize="4xl"
          boxSize="60px"
          ml={[1, 2, 4]}
        />
      </Flex>
      {/* Fullscreen Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay onClick={onClose} cursor="pointer" bg="blackAlpha.800" />
        <ModalContent
          bg="blackAlpha.900"
          maxHeight="100vh"
          {...modalSwipeHandlers}
          position="relative"
          overflow="hidden"
        >
          {/* Close Button */}
          <IconButton
            aria-label="Close fullscreen"
            icon={<CloseIcon />}
            position="absolute"
            top={4}
            right={4}
            zIndex={10}
            colorScheme="whiteAlpha"
            size="lg"
            onClick={onClose}
          />

          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={0}
            cursor="grab"
            userSelect="none"
          >
            <Image
              src={images[currentIndex]}
              alt={`Fullscreen Image ${currentIndex + 1}`}
              maxH="100vh"
              maxW="100vw"
              objectFit="contain"
              pointerEvents="none"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
