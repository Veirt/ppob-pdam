import {
    Box,
    Button,
    Container,
    FormLabel,
    Input,
    useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import type { Employee, Usage, ValidationError } from "../../@types";
import { UserContext } from "../../components/providers/UserProvider";
import api, { isAxiosError } from "../../utils/api";

interface IPaymentState {
    pemakaian: Usage;
    biaya_admin: number;
    petugas: Employee;
}

const Usage: FC<{ usage: Usage }> = ({ usage }) => {
    const router = useRouter();
    const toast = useToast();
    const { user } = useContext(UserContext)!;

    const [isLoading, setLoading] = useState(false);

    const [payment, setPayment] = useState<IPaymentState>({
        petugas: user,
        pemakaian: usage,
        biaya_admin: 0,
    });

    const handlePayment = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(
                "/pembayaran",
                {
                    ...payment,
                    petugas: user,
                },
                { withCredentials: true }
            );

            router.replace("/pembayaran");
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container>
                <form onSubmit={handlePayment} action="POST">
                    <Box my={3}>
                        <FormLabel htmlFor="biaya_admin">Biaya Admin</FormLabel>
                        <Input
                            id="biaya_admin"
                            name="biaya_admin"
                            type="number"
                            value={payment.biaya_admin || ""}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel htmlFor="total_pemakaian">
                            Total Pemakaian
                        </FormLabel>
                        <Input
                            id="total_pemakaian"
                            type="text"
                            value={
                                payment.pemakaian.tagihan.total_pemakaian || ""
                            }
                            disabled
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel htmlFor="total_bayar">Total Bayar</FormLabel>
                        <Input
                            id="total_bayar"
                            type="text"
                            value={payment.pemakaian.tagihan.total_bayar || ""}
                            disabled
                            required
                        />
                    </Box>

                    <Button
                        isLoading={isLoading}
                        type="submit"
                        colorScheme="teal"
                        size="md"
                    >
                        Submit
                    </Button>
                </form>
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await api.get(`/pelanggan/pemakaian/${context.params!.id}`);

    return {
        props: {
            usage: res.data,
        },
    };
};

export default Usage;
