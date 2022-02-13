import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import { FC, useRef, useState } from "react";

interface Props {
    title: string;
    onClick: Function;
}

const DeleteWithAlert: FC<Props> = ({ title, onClick, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef(null);

    return (
        <>
            <Button colorScheme="red" onClick={() => setIsOpen(true)}>
                Delete
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpen(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {title}
                        </AlertDialogHeader>

                        <AlertDialogBody>{children}</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    onClick();
                                    setIsOpen(false);
                                }}
                                ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default DeleteWithAlert;
