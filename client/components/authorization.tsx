import { FC } from "react";
import { useAuth } from "./providers/UserProvider";

interface Props {
    roles: string[];
}

const Authorization: FC<Props> = ({ children, roles }) => {
    const { user } = useAuth();

    if (
        roles.includes(user.role!.nama_role.toLowerCase()) ||
        user.role!.nama_role.toLowerCase() === "admin"
    ) {
        return children as JSX.Element;
    }
    return null;
};

export default Authorization;
