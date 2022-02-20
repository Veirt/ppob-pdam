import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Center,
    CloseButton,
    Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { useAuth } from "../../components/providers/UserProvider";

const ProtectedRoute: FC = ({ children }) => {
    const router = useRouter();
    const { user, loadingUser } = useAuth();

    const unprotectedRoutes = ["/"];

    if ((!user.isAuthenticated && !unprotectedRoutes.includes(router.asPath)) || loadingUser) {
        if (user.isAuthenticated === false && !loadingUser) {
            return (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Anda belum login atau tidak punya akses!</AlertTitle>
                    <AlertDescription>
                        Silakan login terlebih dahulu atau pakai akun yang memiliki hak.
                    </AlertDescription>
                    <CloseButton position="absolute" right="8px" top="8px" />
                </Alert>
            );
        }

        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    if (user.isAuthenticated && unprotectedRoutes.includes(router.asPath)) {
        router.replace("/dashboard");
    }

    return children as JSX.Element;
};

export default ProtectedRoute;
