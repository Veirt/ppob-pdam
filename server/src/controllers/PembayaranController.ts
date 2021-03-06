import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PembayaranPelanggan from "../entities/PembayaranPelanggan";
import Petugas from "../entities/Petugas";
import createReceipt from "../services/ReceiptService";
import { handleError, handleValidationError } from "../utils/errorResponse";
import findTotal from "../utils/findTotal";
import { validatePembayaran } from "../utils/validation";

const pembayaranRepository = getRepository(PembayaranPelanggan);

export const getPembayaranById: Controller = async (req, res) => {
    const pembayaran = await pembayaranRepository.findOne(req.params.id, {
        relations: ["petugas"],
    });

    return res.json(pembayaran);
};

export const getPembayaran: Controller = async (req, res) => {
    const take = Number(req.query.take) || 25;
    const skip = Number(req.query.skip) || 0;

    let [result, count] = await pembayaranRepository.findAndCount({
        skip,
        take,
        relations: ["petugas", "pemakaian", "pemakaian.pelanggan"],
    });

    result = await Promise.all(
        result.map(async (eachPembayaran: PembayaranPelanggan) => {
            const { tarifPemakaian, totalPemakaian } = await findTotal(
                eachPembayaran.pemakaian.pelanggan.id_pelanggan,
                eachPembayaran.pemakaian.meter_awal,
                eachPembayaran.pemakaian.meter_akhir
            );

            if (tarifPemakaian) {
                Object.assign(eachPembayaran, {
                    tagihan: {
                        total_pemakaian: totalPemakaian,
                        total_bayar: tarifPemakaian.tarif * totalPemakaian,
                    },
                });
            }

            return eachPembayaran;
        })
    );

    return res.json({ result, count });
};

export const createPembayaran: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validatePembayaran(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const tanggal_bayar = new Date();

    const pembayaran = {
        biaya_admin: 2500,
        petugas: req.body.petugas as Petugas,
        pemakaian: req.body.pemakaian,
        tanggal_bayar,
    };

    const newPembayaran = pembayaranRepository.create(pembayaran);
    await pembayaranRepository.save(newPembayaran);

    const { writeStream, filePath } = createReceipt(req.body, tanggal_bayar);
    writeStream.on("finish", () => {
        return res.sendFile(filePath);
    });
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
