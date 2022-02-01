import { Box, Flex, Text, Link } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { UserContext } from "./providers/UserProvider";
import NextLink from "next/link";

interface IProps {
    href: string;
}

const LinkItem: FC<IProps> = ({ href, children }) => {
    return (
        <NextLink href={href} passHref>
            <Link>{children}</Link>
        </NextLink>
    );
};

const NavBar = () => {
    const { user } = useContext(UserContext)!;

    return (
        <>
            <Box bg="gray.50">
                <Flex justifyContent={"space-between"} alignItems="center">
                    <Box padding={5}>
                        <Text fontSize={"lg"} as="b">
                            PPOB
                        </Text>
                    </Box>

                    <Box padding={5}>
                        <Flex>
                            {!user.id_petugas ? (
                                <>
                                    <LinkItem href="/login">Login</LinkItem>
                                </>
                            ) : (
                                <>
                                    <LinkItem href="/logout">Logout</LinkItem>
                                </>
                            )}
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default NavBar;
