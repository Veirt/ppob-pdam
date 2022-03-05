import { useToast } from "@chakra-ui/react";
import EmployeeForm, { EmployeeState } from "@components/forms/petugas";
import useFetch from "@hooks/useFetch";
import Toast from "@lib/toast";
import type { ValidationError } from "@types";
import api, { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const EditEmployee = () => {
    const toast = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    const { id } = router.query;
    const [employee, setEmployee] = useFetch<EmployeeState>(`/petugas/${id}`, {
        nama: "",
        username: "",
        password: "",
        role: { id_role: 0, nama_role: "", login: false },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.patch(`/petugas/${id}`, { ...employee });

            router.replace("/petugas");
        } catch (err) {
            if (isAxiosError(err)) {
                err.response!.data.forEach((validationError: ValidationError) => {
                    Toast(toast, "any", validationError.message);
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

export default EditEmployee;
