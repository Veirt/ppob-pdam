import {
    Box,
    Button,
    Container,
    Input,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Customer } from "../../@types";

const Payment = () => {
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer>({
        id_pelanggan: "",
        nama: "",
        alamat: "",
        golongan: { id_golongan: 0 },
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        router.replace(`/pelanggan/${customer.id_pelanggan}/pembayaran`);
    };

    return (
        <>
            <Container maxW="container.md">
                <form onSubmit={handleSubmit}>
                    <Box m={3}>
                        <InputGroup size="md">
                            <Input
                                pr="4.5rem"
                                type="text"
                                onChange={(e) => {
                                    setCustomer({
                                        ...customer,
                                        id_pelanggan: e.target.value,
                                    });
                                }}
                                placeholder="Masukkan ID Pelanggan"
                            />
                            <InputRightElement width="4.5rem">
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={handleSubmit}
                                >
                                    Lanjut
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </form>
            </Container>
        </>
    );
};

export default Payment;
