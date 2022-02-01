import {
    Box,
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

interface State {
    username: string;
    password: string;
}

const Login = () => {
    const toast = useToast();

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
                { ...state }
            );
        } catch (err) {
            toast({
                position: "top-right",
                title: "Error",
                description: (err as AxiosError).response!.data.msg,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <FormControl>
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
                </FormControl>

                <Button
                    isLoading={isLoading}
                    type="submit"
                    colorScheme="teal"
                    size="md"
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default Login;
