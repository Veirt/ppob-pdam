import { Box, Button, Container, FormLabel, Input, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Customer, ValidationError } from "../../../../@types";
import useFetch from "../../../../hooks/useFetch";
import api, { isAxiosError } from "../../../../utils/api";

interface IUsageState {
    pelanggan: Customer;
    meter_awal: number;
    meter_akhir: number;
}

const EditUsage: FC<{ routerParams: ParsedUrlQuery }> = ({ routerParams }) => {
    const [pelanggan] = useFetch(`/pelanggan/${routerParams.id}`, {} as Customer);

    const router = useRouter();
    const toast = useToast();

    const { id_pemakaian } = router.query;

    const [isLoading, setLoading] = useState(false);

    const [usage, setUsage] = useFetch<IUsageState>(`/pelanggan/pemakaian/${id_pemakaian}`, {
        pelanggan: pelanggan,
        meter_awal: 0,
        meter_akhir: 0,
    });

    const handleSubmit = async (e: FormEvent) => {
        setLoading(true);
        e.preventDefault();

        try {
            await api.patch(`/pelanggan/pemakaian/${id_pemakaian}`, {
                ...usage,
                pelanggan: usage.pelanggan.id_pelanggan,
            });

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
        setUsage({ ...usage, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit}>
                    <Box my={3}>
                        <FormLabel htmlFor="nama_pelanggan">Nama Pelanggan</FormLabel>
                        <Input
                            id="nama_pelanggan"
                            type="text"
                            disabled
                            value={usage.pelanggan.nama || ""}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel htmlFor="meter_awal">Meter Awal</FormLabel>
                        <Input
                            id="meter_awal"
                            type="text"
                            value={usage.meter_awal ?? 0}
                            disabled
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel htmlFor="meter_akhir">Meter Akhir</FormLabel>
                        <Input
                            id="meter_akhir"
                            name="meter_akhir"
                            type="number"
                            value={usage.meter_akhir || ""}
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
    return {
        props: {
            routerParams: context.params,
        },
    };
};

export default EditUsage;
