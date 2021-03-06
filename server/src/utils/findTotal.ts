import { getRepository } from "typeorm";
import Pelanggan from "../entities/Pelanggan";
import TarifPemakaian from "../entities/TarifPemakaian";

export default async (pelangganId: number, meter_awal: number, meter_akhir: number) => {
    const tarifRepository = getRepository(TarifPemakaian);

    // find total_bayar and total_pemakaian
    const pelanggan = await getRepository(Pelanggan).findOneOrFail(pelangganId, {
        relations: ["golongan"],
    });
    const totalPemakaian = meter_akhir - meter_awal;

    const tarifPemakaian = await tarifRepository
        .createQueryBuilder()
        .where("golongan = :golongan")
        .andWhere(
            "IF(meter_kubik_akhir IS NULL, :total_pemakaian > meter_kubik_awal, :total_pemakaian BETWEEN meter_kubik_awal AND meter_kubik_akhir)"
        )
        .setParameters({
            golongan: pelanggan.golongan.id_golongan,
            total_pemakaian: totalPemakaian,
        })
        .getOne();

    return { tarifPemakaian, totalPemakaian };
};
