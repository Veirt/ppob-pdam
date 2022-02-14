import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { Tarif } from "../../@types";
import GolonganForm, { GolonganState } from "../../components/forms/golongan";
import api from "../../utils/api";

const CreateGolongan = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const [tarif, setTarif] = useState<Tarif[]>([{ kubik_awal: 0, kubik_akhir: null, tarif: 0 }]);

    const [golongan, setGolongan] = useState<GolonganState>({
        nama_golongan: "",
        tarif,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGolongan({ ...golongan, [e.target.name]: e.target.value });
    };

    const handleTarifChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        const newTarif = golongan.tarif.slice();
        newTarif[i][e.target.name as keyof Tarif] = Number(e.target.value);

        setGolongan({ ...golongan, tarif: newTarif });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log(golongan);
            await api.post("/golongan", { ...golongan }, { withCredentials: true });
            router.replace("/golongan");
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <GolonganForm
                state={golongan}
                setState={setGolongan}
                setTarif={setTarif}
                handleChange={handleChange}
                handleTarifChange={handleTarifChange}
                isLoading={isLoading}
                handleSubmit={handleSubmit}></GolonganForm>
        </>
    );
};

export default CreateGolongan;
