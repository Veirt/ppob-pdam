import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { UserContext } from "../../components/providers/UserProvider";

const ProtectedRoute: FC = ({ children }) => {
    const router = useRouter();
    const { user, loadingUser } = useContext(UserContext)!;

    const unprotectedRoutes = ["/"];

    if ((!user.isAuthenticated && !unprotectedRoutes.includes(router.asPath)) || loadingUser) {
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
