import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { ValidationError } from "../../@types";
import CustomerForm, { ICustomerState } from "../../components/forms/pelanggan";
import useFetch from "../../hooks/useFetch";
import api, { isAxiosError } from "../../utils/api";

const EditCustomer = () => {
    const toast = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    const { id } = router.query;
    const [customer, setCustomer] = useFetch<ICustomerState>(
        `/pelanggan/${id}`,
        {
            nama: "",
            alamat: "",
            golongan: { id_golongan: 0, nama_golongan: "" },
        }
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.patch(
                `/pelanggan/${id}`,
                { ...customer },
                { withCredentials: true }
            );

            router.replace("/pelanggan");
        } catch (err) {
            if (isAxiosError(err)) {
                err.response!.data.forEach(
                    (validationError: ValidationError) => {
                        toast({
                            position: "top-right",
                            title: "Error",
                            description: validationError.message,
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                );
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

export default EditCustomer;