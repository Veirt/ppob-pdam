import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import PembayaranPelanggan from "../entities/PembayaranPelanggan";
import Petugas from "../entities/Petugas";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validatePembayaran } from "../utils/validation";

const pembayaranRepository = getRepository(PembayaranPelanggan);
const pemakaianRepository = getRepository(PemakaianPelanggan);

export const getPembayaranById: Controller = async (req, res) => {
    const pembayaran = await pembayaranRepository.findOne(req.params.id, {
        relations: ["petugas"],
    });

    return res.json(pembayaran);
};

export const getPembayaran: Controller = async (_, res) => {
    const pembayaran = await pembayaranRepository.find({
        relations: ["petugas"],
    });

    return res.json(pembayaran);
};

export const createPembayaran: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validatePembayaran(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const tanggal_bayar = new Date();

    const pembayaran = {
        biaya_admin: req.body.biaya_admin as number,
        petugas: req.body.petugas as Petugas,
        pemakaian: req.body.pemakaian,
        tanggal_bayar,
    };

    const newPembayaran = pembayaranRepository.create(pembayaran);
    await pembayaranRepository.save(newPembayaran);
    await pemakaianRepository.update(req.body.pemakaian.id_pemakaian, {
        pembayaran: newPembayaran,
    });

    return res.status(204).json(pembayaran);
};

export const updatePembayaran: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validatePembayaran(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const pembayaran = await pembayaranRepository.findOne(req.params.id);
    if (!pembayaran) return handleError("notFound", res);

    await pembayaranRepository.update(pembayaran, req.body);

    return res.status(204).json();
};

export const deletePembayaran: Controller = async (req, res) => {
    const pembayaran = await pembayaranRepository.findOne(req.params.id);

    if (!pembayaran) return handleError("notFound", res);

    const deletedPembayaran = await pembayaranRepository.delete(req.params.id);

    return res.json(deletedPembayaran);
};
