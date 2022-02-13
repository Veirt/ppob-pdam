import axios from "axios";
import { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { User } from "../../@types";

interface Context {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
}

export const UserContext = createContext<Context | null>(null);

export const UserProvider: FC = ({ children }) => {
    const [user, setUser] = useState<User>({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/@me`, {
                    withCredentials: true,
                });

                setUser(res.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status !== 401) {
                        console.error(`Unexpected error when logging in: ${err}`);
                    }
                }
            }
        };

        fetchUser();
    }, []);
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
