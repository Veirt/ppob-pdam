import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import TarifPemakaian from "../entities/TarifPemakaian";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validateTarif } from "../utils/validation";

const tarifRepository = getRepository(TarifPemakaian);

export const getTarifById: Controller = async (req, res) => {
    const tarif = await tarifRepository.findOne(req.params.id, {
        relations: ["golongan"],
    });

    return res.json(tarif);
};

export const getTarif: Controller = async (_, res) => {
    const tarif = await tarifRepository.find({
        relations: ["golongan"],
    });

    return res.json(tarif);
};

export const createTarif: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateTarif(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const { kubik_awal, kubik_akhir, tarif, golongan } = req.body;
    const newTarif = tarifRepository.create({
        kubik_awal,
        kubik_akhir,
        tarif,
        golongan,
    });

    const savedTarif = await tarifRepository.save(newTarif);

    return res.json(savedTarif);
};

export const updateTarif: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateTarif(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const tarif = await tarifRepository.findOne(req.params.id);
    if (!tarif) return handleError("notFound", res);

    await tarifRepository.update(tarif, req.body);

    return res.status(204).json();
};

export const deleteTarif: Controller = async (req, res) => {
    const tarif = await tarifRepository.findOne(req.params.id);
    if (!tarif) return handleError("notFound", res);

    const deletedTarif = await tarifRepository.delete(req.params.id);

    return res.json(deletedTarif);
};
