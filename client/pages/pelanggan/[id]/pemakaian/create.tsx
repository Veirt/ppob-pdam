import { Box, Button, Container, FormLabel, Input, useToast } from "@chakra-ui/react";
import Toast from "@lib/toast";
import { Customer, ValidationError } from "@types";
import api, { isAxiosError } from "@utils/api";
import toPeriod from "@utils/toPeriod";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

interface IUsageState {
    pelanggan: Customer;
    meter_akhir: number;
}

const CreateUsage: FC<{ routerParams: ParsedUrlQuery }> = ({ routerParams }) => {
    const router = useRouter();
    const toast = useToast();

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPelanggan() {
            const res = await api.get(`/pelanggan/${routerParams.id}`);

            setUsage({ ...usage, pelanggan: res.data });
        }
        fetchPelanggan();
    }, []);

    const [usage, setUsage] = useState<IUsageState>({
        pelanggan: {
            nama: "",
            id_pelanggan: 0,
            golongan: { id_golongan: 0 },
            alamat: "",
            sudah_dicatat: false,
            pemakaian: [],
        },
        meter_akhir: 0,
    });

    const handleSubmit = async (e: FormEvent) => {
        setLoading(true);
        e.preventDefault();

        try {
            await api.post("/pelanggan/pemakaian", {
                ...usage,
                pelanggan: usage.pelanggan.id_pelanggan,
            });

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
                        <FormLabel>Periode</FormLabel>
                        <Input type="text" disabled value={toPeriod(new Date())} />
                    </Box>

                    <Box my={3}>
                        <FormLabel htmlFor="meter_awal">Meter Awal</FormLabel>
                        <Input
                            id="meter_awal"
                            type="text"
                            value={usage.pelanggan.pemakaian?.at(-1)?.meter_akhir || 0}
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
                            value={usage.meter_akhir}
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

export default CreateUsage;
