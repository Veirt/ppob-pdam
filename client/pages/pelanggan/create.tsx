import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { ValidationError } from "../../@types";
import CustomerForm, { CustomerState } from "../../components/forms/pelanggan";
import api, { isAxiosError } from "../../utils/api";

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
            <CustomerForm
                state={customer}
                setState={setCustomer}
                isLoading={isLoading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
};

export default CreateCustomer;
