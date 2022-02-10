import { getRepository, ILike } from "typeorm";
import type { Controller } from "../../@types/express";
import Pelanggan from "../entities/Pelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import findTotal from "../utils/findTotal";
import { validatePelanggan } from "../utils/validation";

const pelangganRepository = getRepository(Pelanggan);

export const getPelangganById: Controller = async (req, res) => {
    const pelanggan = await pelangganRepository.findOne(req.params.id, {
        relations: ["golongan", "pemakaian", "pemakaian.pembayaran"],
    });

    if (pelanggan) {
        pelanggan.pemakaian = await Promise.all(
            pelanggan?.pemakaian.map(async (eachPemakaian) => {
                const { tarifPemakaian, totalPemakaian } = await findTotal(
                    pelanggan.id_pelanggan,
                    eachPemakaian.meter_awal,
                    eachPemakaian.meter_akhir
                );

                if (tarifPemakaian) {
                    Object.assign(eachPemakaian, {
                        tagihan: {
                            total_pemakaian: totalPemakaian,
                            total_bayar: tarifPemakaian.tarif * totalPemakaian,
                        },
                    });
                }

                return eachPemakaian;
            })
        );
    }

    return res.json(pelanggan);
};

export const getPelanggan: Controller = async (req, res) => {
    const { search } = req.query;

    const pelanggan = await pelangganRepository.find({
        relations: ["golongan"],
        where: {
            nama: ILike(`%${search}%`),
        },
    });

    return res.json(pelanggan);
};

export const createPelanggan: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePelanggan(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const newPelanggan = pelangganRepository.create({
        nama: req.body.nama,
        alamat: req.body.alamat,
        golongan: req.body.golongan,
    });
    const savedPelanggan = await pelangganRepository.save(newPelanggan);

    return res.json(savedPelanggan);
};

export const updatePelanggan: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePelanggan(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const pelanggan = await pelangganRepository.findOne(req.params.id, {
        relations: ["golongan"],
    });
    if (!pelanggan) return handleError("notFound", res);

    await pelangganRepository.update(pelanggan, {
        nama: req.body.nama,
        alamat: req.body.alamat,
        golongan: req.body.golongan.id_golongan,
    });

    return res.status(204).json();
};

export const deletePelanggan: Controller = async (req, res) => {
    const pelanggan = await pelangganRepository.findOne(req.params.id);
    if (!pelanggan) return handleError("notFound", res);

    const deletedPelanggan = await pelangganRepository.delete(req.params.id);

    return res.json(deletedPelanggan);
};
