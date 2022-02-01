import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "../../components/providers/UserProvider";

const Logout = () => {
    const router = useRouter();
    const { setUser } = useContext(UserContext)!;

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
                router.replace("/login");
            }
        };

        logOut();
    }, []);

    return <> </>;
};

export default Logout;
