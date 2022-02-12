import { ValidationError } from "fastest-validator";
import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import findPrevUsage from "../utils/findPrevUsage";
import findTotal from "../utils/findTotal";
import { validatePemakaian } from "../utils/validation";

const pemakaianRepository = getRepository(PemakaianPelanggan);

export const getPemakaianById: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id, {
        relations: ["pelanggan", "pelanggan.golongan"],
    });

    if (!pemakaian) return handleError("notFound", res);

    const { tarifPemakaian, totalPemakaian } = await findTotal(
        pemakaian.pelanggan.id_pelanggan,
        pemakaian.meter_awal,
        pemakaian.meter_akhir
    );

    if (tarifPemakaian) {
        Object.assign(pemakaian, {
            tagihan: {
                total_pemakaian: totalPemakaian,
                total_bayar: tarifPemakaian.tarif * totalPemakaian,
            },
        });
    }

    return res.json(pemakaian);
};

export const getPemakaian: Controller = async (_, res) => {
    const pemakaian = await pemakaianRepository.find({
        relations: ["pelanggan"],
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

    const meter_akhir = Number(req.body.meter_akhir);

    const meter_awal = await findPrevUsage(req.body.pelanggan);
    if (meter_akhir < meter_awal) {
        return res.status(400).json([
            {
                type: "invalid",
                field: "meter_akhir",
                message: "Meter akhir kurang dari meter awal",
            } as ValidationError,
        ]);
    }

    try {
        const { tarifPemakaian } = await findTotal(
            req.body.pelanggan,
            meter_awal,
            meter_akhir
        );

        if (!tarifPemakaian) {
            return res.status(400).json([
                {
                    type: "invalid",
                    field: "pelanggan",
                    message: "Golongan tidak punya tarif",
                } as ValidationError,
            ]);
        }

        // const total_bayar = tarifPemakaian.tarif * totalPemakaian;

        const newPemakaian = pemakaianRepository.create({
            pelanggan: req.body.pelanggan,
            meter_awal,
            meter_akhir: req.body.meter_akhir,
            tanggal: new Date(),
        });

        const savedPemakaian = await pemakaianRepository.save(newPemakaian);

        return res.json(savedPemakaian);
    } catch (err) {
        return res.status(400).json([
            {
                type: "invalid",
                field: "meter_akhir",
                message: "Tidak ada tarif pemakaian untuk golongan",
            },
        ]);
    }
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
