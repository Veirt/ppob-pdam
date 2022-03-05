import type { User } from "@types";
import api, { isAxiosError } from "@utils/api";
import {
    createContext,
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

interface Context {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
    loadingUser: boolean;
}

const UserContext = createContext<Context | null>(null);

export const UserProvider: FC = ({ children }) => {
    const [loadingUser, setLoading] = useState(false);
    const [user, setUser] = useState<User>({});

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);

            try {
                const res = await api.get("/auth/@me", {
                    withCredentials: true,
                });

                setUser({ ...res.data, isAuthenticated: true });
            } catch (err) {
                setUser({ isAuthenticated: false });
                if (isAxiosError(err)) {
                    if (err.response?.status !== 401) {
                        console.error(`Unexpected error when logging in: ${err}`);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser, loadingUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext)!;
