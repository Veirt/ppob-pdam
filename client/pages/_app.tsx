import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import NavBar from "../components/navbar";
import { UserProvider } from "../components/providers/UserProvider";
import ProtectedRoute from "../lib/auth/route";

function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <UserProvider>
                <NavBar />
                <ProtectedRoute>
                    <Component {...pageProps} />
                </ProtectedRoute>
            </UserProvider>
        </ChakraProvider>
    );
}

export default App;
