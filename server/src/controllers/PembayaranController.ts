import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PembayaranPelanggan from "../entities/PembayaranPelanggan";
import TagihanPelanggan from "../entities/TagihanPelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validatePembayaran } from "../utils/validation";

const pembayaranRepository = getRepository(PembayaranPelanggan);
const tagihanRepository = getRepository(TagihanPelanggan);

export const getPembayaranById: Controller = async (req, res) => {
    const pembayaran = await pembayaranRepository.findOne(req.params.id, {
        relations: ["petugas"],
    });

    return res.json(pembayaran);
};

export const getPembayaran: Controller = async (_, res) => {
    const pembayaran = await pembayaranRepository.find({
        relations: ["petugas", "tagihan"],
    });

    return res.json(pembayaran);
};

export const createPembayaran: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePembayaran(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const tanggal_bayar = new Date();

    // TODO: cek denda
    // relasi dengan pemakaian
    const tagihan = await tagihanRepository.findOne(req.body.tagihan, {
        relations: ["pembayaran"],
    });

    // temp
    if (!tagihan) return;

    const pembayaran = {
        biaya_admin: req.body.biaya_admin,
        petugas: req.body.petugas,
        tanggal_bayar,
    };

    tagihanRepository.update(tagihan, {
        denda:
            tanggal_bayar.getDate() > 20
                ? tagihan.total_bayar * 0.1
                : undefined,
        pembayaran,
    });

    return res.status(204).json(pembayaran);
};

export const updatePembayaran: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePembayaran(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

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
