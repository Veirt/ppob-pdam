import { Box, Button, Container, FormLabel, Input, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Employee, Usage, ValidationError } from "../../../@types";
import { useAuth } from "../../../components/providers/UserProvider";
import api, { isAxiosError } from "../../../utils/api";
import toCurrency from "../../../utils/toCurrency";
import toPeriod from "../../../utils/toPeriod";

interface IPaymentState {
    pemakaian: Usage;
    biaya_admin: number;
    petugas: Employee;
}

const Usage: FC<{ usage: Usage }> = ({ usage }) => {
    const router = useRouter();
    const toast = useToast();

    const { user } = useAuth();

    const [isLoading, setLoading] = useState(false);

    const [payment, setPayment] = useState<IPaymentState>({
        petugas: user as Employee,
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

            router.back();
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container>
                <form onSubmit={handlePayment} action="POST">
                    <Box my={3}>
                        <FormLabel>Nama Pelanggan</FormLabel>
                        <Input
                            type="text"
                            value={payment.pemakaian.pelanggan?.nama || ""}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Golongan</FormLabel>
                        <Input
                            type="text"
                            value={payment.pemakaian.pelanggan?.golongan.nama_golongan || ""}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Meteran</FormLabel>
                        <Input
                            type="text"
                            value={`${payment.pemakaian.meter_awal} - ${payment.pemakaian.meter_akhir}`}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Periode Pemakaian</FormLabel>
                        <Input type="text" value={toPeriod(payment.pemakaian.tanggal)} disabled />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Total Pemakaian</FormLabel>
                        <Input
                            type="text"
                            value={payment.pemakaian.tagihan.total_pemakaian}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Total Bayar</FormLabel>
                        <Input
                            type="text"
                            value={toCurrency(payment.pemakaian.tagihan.total_bayar)}
                            disabled
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Denda</FormLabel>
                        <Input
                            type="text"
                            value={toCurrency(payment.pemakaian.denda || 0)}
                            disabled
                            required
                        />
                    </Box>

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

                    <Button isLoading={isLoading} type="submit" colorScheme="teal" size="md">
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