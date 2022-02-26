import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { ValidationError } from "../../@types";
import RoleForm, { RoleState } from "../../components/forms/role";
import api, { isAxiosError } from "../../utils/api";

const EditRole = () => {
    const toast = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    const [role, setRole] = useState<RoleState>({ nama_role: "", login: false });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRole({ ...role, [e.target.name]: e.target.value ? e.target.value : e.target.checked });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/petugas/role", { ...role });

            router.replace("/role");
        } catch (err) {
            if (isAxiosError(err)) {
                err.response!.data.forEach((validationError: ValidationError) => {
                    toast({
                        position: "top-right",
                        title: "Error",
                        description: validationError.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <RoleForm
                state={role}
                setState={setRole}
                isLoading={isLoading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
};

export default EditRole;
