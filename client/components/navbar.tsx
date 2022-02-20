import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { useAuth } from "./providers/UserProvider";

interface Props {
    href: string;
}

const LinkItem: FC<Props> = ({ href, children }) => {
    return (
        <NextLink href={href} passHref>
            <Link mx="3">{children}</Link>
        </NextLink>
    );
};

const NavBar = () => {
    const router = useRouter();

    const { user } = useAuth();

    return (
        <>
            <Box bg="gray.50">
                <Flex justifyContent={"space-between"} alignItems="center">
                    <Box padding={5}>
                        <Text fontSize={"lg"} as="b">
                            <NextLink href="/">PPOB</NextLink>
                        </Text>
                    </Box>

                    <Box padding={5}>
                        <Flex>
                            {!user.id_petugas ? (
                                <>
                                    <LinkItem href="/">Login</LinkItem>
                                </>
                            ) : (
                                <Flex alignItems={"center"}>
                                    {/* <LinkItem href="/logout">Logout</LinkItem> */}
                                    <Text mx="3">{user.nama}</Text>
                                    <Avatar bg="teal.500" size={"sm"} />
                                    <Menu>
                                        <MenuButton
                                            mx="3"
                                            as={IconButton}
                                            aria-label="Options"
                                            icon={<ChevronDownIcon />}
                                        />
                                        <MenuList>
                                            <MenuItem onClick={() => router.replace("/logout")}>
                                                Log out
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Flex>
                            )}
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default NavBar;
