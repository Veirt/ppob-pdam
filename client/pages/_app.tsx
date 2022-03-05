import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "@components/navbar";
import { UserProvider } from "@components/providers/UserProvider";
import ProtectedRoute from "@lib/auth/route";
import type { AppProps } from "next/app";

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
