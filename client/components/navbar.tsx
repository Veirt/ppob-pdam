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
import Authorization from "./authorization";
import { useAuth } from "./providers/UserProvider";

interface Props {
    href: string;
    path?: string;
}

const LinkItem: FC<Props> = ({ href, path, children }) => {
    const active = href === path;
    return (
        <NextLink href={href} passHref>
            <Link as="b" mx="3" color={active ? "teal.400" : "black"}>
                {children}
            </Link>
        </NextLink>
    );
};

const NavBar = () => {
    const router = useRouter();
    const path = router.asPath;

    const { user } = useAuth();

    return (
        <>
            <Box bg="gray.50">
                <Flex justifyContent={"space-between"} alignItems="center">
                    <Box padding={5}>
                        <Flex alignItems={"center"}>
                            <Text fontSize={"2xl"} color="teal" mr="5" as="b">
                                <NextLink href="/">PPOB</NextLink>
                            </Text>

                            <Authorization>
                                <LinkItem path={path} href="/dashboard">
                                    Dashboard
                                </LinkItem>
                                <LinkItem path={path} href="/pelanggan">
                                    Pelanggan
                                </LinkItem>
                            </Authorization>

                            <Authorization roles={["petugas meteran"]}>
                                <LinkItem path={path} href="/pemakaian">
                                    Pemakaian
                                </LinkItem>
                            </Authorization>

                            <Authorization roles={["petugas loket"]}>
                                <LinkItem path={path} href="/pelanggan/tagihan">
                                    Tagihan
                                </LinkItem>
                                <LinkItem path={path} href="/pembayaran">
                                    Pembayaran
                                </LinkItem>
                            </Authorization>

                            <Authorization roles={["admin"]}>
                                <LinkItem path={path} href="/petugas">
                                    Petugas
                                </LinkItem>
                                <LinkItem path={path} href="/golongan">
                                    Golongan
                                </LinkItem>
                                <LinkItem path={path} href="/role">
                                    Role
                                </LinkItem>
                            </Authorization>
                        </Flex>
                    </Box>

                    <Box padding={5}>
                        <Flex>
                            {!user.id_petugas ? (
                                <>
                                    <LinkItem href="/">Login</LinkItem>
                                </>
                            ) : (
                                <Flex alignItems={"center"}>
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
