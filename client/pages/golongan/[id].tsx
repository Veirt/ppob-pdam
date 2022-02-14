import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { Tarif } from "../../@types";
import GolonganForm, { GolonganState } from "../../components/forms/golongan";
import useFetch from "../../hooks/useFetch";
import api from "../../utils/api";

const EditGolongan = () => {
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
        newTarif[i][e.target.name as keyof Tarif] = Number(e.target.value);

        setGolongan({ ...golongan, tarif: newTarif });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.patch(`/golongan/${id}`, { ...golongan }, { withCredentials: true });
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
                handleChange={handleChange}
                handleTarifChange={handleTarifChange}
                isLoading={isLoading}
                handleSubmit={handleSubmit}></GolonganForm>
        </>
    );
};

export default EditGolongan;
