import { getRepository } from "typeorm";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";

export default async (pelangganId: number) => {
    const pemakaianRepository = getRepository(PemakaianPelanggan);

    const prevPemakaian = await pemakaianRepository.find({
        where: { pelanggan: pelangganId },
        order: { tanggal: "ASC" },
    });

    let meter_awal = 0;
    if (prevPemakaian.length > 0) {
        meter_awal = prevPemakaian.at(-1)!.meter_akhir;
    }

    return meter_awal;
};
