import { useToast } from "@chakra-ui/react";
import type { GolonganState } from "@components/forms/golongan";
import GolonganForm from "@components/forms/golongan";
import useFetch from "@hooks/useFetch";
import type { Tarif } from "@types";
import api, { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const EditGolongan = () => {
    const toast = useToast();
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setLoading] = useState(false);

    const [golongan, setGolongan] = useFetch<GolonganState>(`/golongan/${id}`, {
        nama_golongan: "",
        tarif: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGolongan({ ...golongan, [e.target.name]: e.target.value });
    };

    const handleTarifChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        const newTarif = golongan.tarif.slice();
        (newTarif as any)[i][e.target.name as keyof Tarif] = e.target.value;

        if (newTarif.length > 1 && e.target.name === "meter_kubik_akhir") {
            newTarif[i + 1]["meter_kubik_awal"] = Number(e.target.value) + 1;
        }

        setGolongan({ ...golongan, tarif: newTarif });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.patch(`/golongan/${id}`, { ...golongan });
            router.replace("/golongan");
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response!.status === 400) {
                    toast({
                        position: "top-right",
                        title: "Error",
                        description: err.response?.data[0].message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <GolonganForm
            state={golongan}
            setState={setGolongan}
            handleChange={handleChange}
            handleTarifChange={handleTarifChange}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
        />
    );
};

export default EditGolongan;
