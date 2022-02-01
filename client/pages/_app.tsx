import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "../components/navbar";
import { UserProvider } from "../components/providers/UserProvider";

function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <UserProvider>
                <NavBar />
                <Component {...pageProps} />
            </UserProvider>
        </ChakraProvider>
    );
}

export default App;
