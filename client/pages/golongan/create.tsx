import { useToast } from "@chakra-ui/react";
import type { GolonganState } from "@components/forms/golongan";
import GolonganForm from "@components/forms/golongan";
import Toast from "@lib/toast";
import type { Tarif } from "@types";
import api, { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const CreateGolongan = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();

    const [golongan, setGolongan] = useState<GolonganState>({
        nama_golongan: "",
        tarif: [{ meter_kubik_awal: 0, meter_kubik_akhir: null, tarif: 0 }],
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
            await api.post("/golongan", { ...golongan });
            router.replace("/golongan");
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response!.status === 400) {
                    Toast(toast, "any", err.response?.data[0].message);
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

export default CreateGolongan;
