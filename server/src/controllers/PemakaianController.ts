import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validatePemakaian } from "../utils/validation";

const pemakaianRepository = getRepository(PemakaianPelanggan);

export const getPemakaianById: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id, {
        relations: ["pelanggan"],
    });

    return res.json(pemakaian);
};

export const getPemakaian: Controller = async (_, res) => {
    const pemakaian = await pemakaianRepository.find({
        relations: ["pelanggan"],
    });

    return res.json(pemakaian);
};

export const createPemakaian: Controller = async (req, res) => {
    // TODO: cek tunggakan dan apakah sudah bulan ini
    const validationResult = handleValidationError(
        await validatePemakaian(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const newPemakaian = pemakaianRepository.create({
        pelanggan: req.body.pelanggan,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir,
        tanggal: new Date(),
        sudah_dibayar: 0,
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
