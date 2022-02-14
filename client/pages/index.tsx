import { Box, Button, Container, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { UserContext } from "../components/providers/UserProvider";
import api, { isAxiosError } from "../utils/api";

interface State {
    username: string;
    password: string;
}

const Login = () => {
    const router = useRouter();
    const toast = useToast();

    const { loadingUser } = useContext(UserContext)!;

    const [state, setState] = useState<State>({ username: "", password: "" });
    const [isLoading, setLoading] = useState(false);

    const { setUser } = useContext(UserContext)!;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
                { ...state },
                { withCredentials: true }
            );

            console.log(res.data);
            setUser(res.data);

            router.replace("/");
        } catch (err) {
            if (isAxiosError(err)) {
                toast({
                    position: "top-right",
                    title: "Error",
                    description: err.response!.data.msg,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }

            console.error(`Unexpected error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loadingUser && (
                <Container>
                    <form onSubmit={handleSubmit}>
                        <Box my={3}>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={state.username}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box my={3}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={state.password}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Button isLoading={isLoading} type="submit" colorScheme="teal" size="md">
                            Submit
                        </Button>
                    </form>
                </Container>
            )}
        </>
    );
};

export default Login;
