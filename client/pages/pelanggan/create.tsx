import { useToast } from "@chakra-ui/react";
import CustomerForm, { CustomerState } from "@components/forms/pelanggan";
import Toast from "@lib/toast";
import type { ValidationError } from "@types";
import api, { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const CreateCustomer = () => {
    const toast = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    const [customer, setCustomer] = useState<CustomerState>({
        nama: "",
        alamat: "",
        golongan: { id_golongan: 0, nama_golongan: "" },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/pelanggan", { ...customer });

            router.replace("/pelanggan");
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
        <CustomerForm
            state={customer}
            setState={setCustomer}
            isLoading={isLoading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
    );
};

export default CreateCustomer;
