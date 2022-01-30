import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import Pelanggan from "../entities/Pelanggan";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import TarifPemakaian from "../entities/TarifPemakaian";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validatePemakaian } from "../utils/validation";

const pemakaianRepository = getRepository(PemakaianPelanggan);
const tarifRepository = getRepository(TarifPemakaian);

export const getPemakaianById: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id, {
        relations: ["pelanggan", "tagihan"],
    });

    return res.json(pemakaian);
};

export const getPemakaian: Controller = async (_, res) => {
    const pemakaian = await pemakaianRepository.find({
        relations: ["pelanggan", "tagihan"],
    });

    return res.json(pemakaian);
};

export const createPemakaian: Controller = async (req, res) => {
    // TODO: cek tunggakan
    const validationResult = handleValidationError(
        await validatePemakaian(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const prevPemakaian = await pemakaianRepository.find({
        relations: ["tagihan", "tagihan.pembayaran"],
        where: { pelanggan: req.body.pelanggan },
        order: { tanggal: "ASC" },
    });

    // handle finding the meter_awal
    let meter_awal = 0;
    if (prevPemakaian.length > 0) {
        meter_awal = prevPemakaian.at(-1)!.meter_akhir;

        // give denda if pembayaran sebelumny blum dibayar
        if (!prevPemakaian.at(-1)?.tagihan.pembayaran) {
            pemakaianRepository.save({
                ...prevPemakaian.at(-1),
                tagihan: {
                    ...prevPemakaian.at(-1)!.tagihan,
                    denda: prevPemakaian.at(-1)!.tagihan.total_bayar * 0.1,
                },
            });
        }
    }

    // find total_bayar and total_pemakaian
    const pelanggan = await getRepository(Pelanggan).findOneOrFail(
        req.body.pelanggan,
        {
            relations: ["golongan"],
        }
    );
    const total_pemakaian = req.body.meter_akhir - meter_awal;
    const tarifPemakaian = await tarifRepository
        .createQueryBuilder()
        .where("golongan = :golongan", {})
        .andWhere(
            "IF(kubik_akhir IS NULL, :total_pemakaian > kubik_awal, :total_pemakaian BETWEEN kubik_awal AND kubik_akhir)"
        )
        .setParameters({
            golongan: pelanggan.golongan.id_golongan,
            total_pemakaian,
        })
        .getOne();

    const total_bayar = total_pemakaian * Number(tarifPemakaian?.tarif);

    const newPemakaian = pemakaianRepository.create({
        pelanggan: req.body.pelanggan,
        meter_awal,
        meter_akhir: req.body.meter_akhir,
        tanggal: new Date(),
        tagihan: { total_bayar, total_pemakaian },
    });

    const savedPemakaian = await pemakaianRepository.save(newPemakaian);

    return res.json(savedPemakaian);
};

export const updatePemakaian: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePemakaian(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const pemakaian = await pemakaianRepository.findOne(req.params.id);
    if (!pemakaian) return handleError("notFound", res);

    await pemakaianRepository.update(pemakaian, req.body);

    return res.status(204).json();
};

export const deletePemakaian: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id);

    if (!pemakaian) return handleError("notFound", res);

    const deletedPemakaian = await pemakaianRepository.delete(req.params.id);

    return res.json(deletedPemakaian);
};
