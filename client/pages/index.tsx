import { Box, Button, Container, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useAuth } from "@components/providers/UserProvider";
import Toast from "@lib/toast";
import axios from "axios";
import { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

interface State {
    username: string;
    password: string;
}

const Login = () => {
    const router = useRouter();
    const toast = useToast();

    const { loadingUser, setUser } = useAuth();

    const [state, setState] = useState<State>({ username: "", password: "" });
    const [isLoading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
                {
                    ...state,
                },
                { withCredentials: true }
            );

            setUser(res.data);

            router.replace("/dashboard");
        } catch (err) {
            if (isAxiosError(err)) {
                Toast(toast, "any", err.response?.data.msg);
            }

            console.error(`Unexpected error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!loadingUser && (
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
