import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Text,
    Image,
} from "@chakra-ui/react";
import { useState } from "react";

const ChatMateModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Check if user.founder exists before trying to access its properties
    const chatMateName = user.name ? user.name : "Unknown Founder";
    const chatMateEmail = user.email ? user.email : "Unknown Email";
    const chatMatePic = user.pic.url ? user.pic.url : "";

    return (
        <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
        )}
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent h="410px">
            <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                d="flex"
                justifyContent="center"
            >
                <p>
                    <span className="font-bold">{chatMateName}</span>
                </p>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                d="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                borderRadius="full"
                boxSize="150px"
                src={chatMatePic}
                // src=""
                alt={chatMateName}
                // alt="hello"
                />
                <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                >
                Email: {chatMateEmail}
                </Text>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
};

export default ChatMateModal;
