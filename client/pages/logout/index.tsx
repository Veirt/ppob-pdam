import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../components/providers/UserProvider";

const Logout = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    useEffect(() => {
        const logOut = async () => {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`,
                    {},
                    { withCredentials: true }
                );

                setUser({});
            } catch (err) {
                console.error(err);
            } finally {
                router.replace("/");
            }
        };

        logOut();
    }, []);

    return <> </>;
};

export default Logout;
