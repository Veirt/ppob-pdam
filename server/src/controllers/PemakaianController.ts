import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import Denda from "../entities/Denda";
import Pelanggan from "../entities/Pelanggan";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import TarifPemakaian from "../entities/TarifPemakaian";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validatePemakaian } from "../utils/validation";

const pemakaianRepository = getRepository(PemakaianPelanggan);
const tarifRepository = getRepository(TarifPemakaian);
const dendaRepository = getRepository(Denda);

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
        where: { tagihan: { pembayaran: null } },
    });

    // find total_bayar and total_pemakaian
    const pelanggan = await getRepository(Pelanggan).findOneOrFail(
        req.body.pelanggan,
        {
            relations: ["golongan"],
        }
    );
    const total_pemakaian = req.body.meter_akhir - req.body.meter_awal;
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

    if (prevPemakaian.length > 0) {
        // DENDA
        const total_denda = total_bayar * 0.1;
        await dendaRepository.save({
            pelanggan,
            total_denda,
            sudah_dibayar: 0,
        });
    }

    const newPemakaian = pemakaianRepository.create({
        pelanggan: req.body.pelanggan,
        meter_awal: req.body.meter_awal,
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
