import { FC } from "react";
import { User } from "../@types";
import { useAuth } from "./providers/UserProvider";

interface Props {
    roles?: string[];
    userProp?: User;
}

const Authorization: FC<Props> = ({ children, roles, userProp }) => {
    const { user: userContext } = useAuth();

    const user = userContext.role ? userContext : userProp;

    if (!roles && user?.id_petugas) {
        return children as JSX.Element;
    }

    if (
        (user?.role && roles?.includes(user.role?.nama_role.toLowerCase())) ||
        user?.role?.nama_role.toLowerCase() === "admin"
    ) {
        return children as JSX.Element;
    }

    return null;
};

export default Authorization;
