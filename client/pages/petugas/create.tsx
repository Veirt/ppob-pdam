import { useToast } from "@chakra-ui/react";
import EmployeeForm, { EmployeeState } from "@components/forms/petugas";
import { ValidationError } from "@types";
import api, { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const CreateEmployee = () => {
    const toast = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    const [employee, setEmployee] = useState<EmployeeState>({
        nama: "",
        username: "",
        password: "",
        role: {
            id_role: 0,
            nama_role: "",
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/petugas", { ...employee });

            router.replace("/petugas");
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
        <EmployeeForm
            state={employee}
            setState={setEmployee}
            isLoading={isLoading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
    );
};

export default CreateEmployee;
