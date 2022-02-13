import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import Golongan from "../entities/GolonganPelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validateGolongan } from "../utils/validation";

const golonganRepository = getRepository(Golongan);

export const getGolonganById: Controller = async (req, res) => {
    const golongan = await golonganRepository.findOne(req.params.id, { relations: ["tarif"] });

    return res.json(golongan);
};

export const getGolongan: Controller = async (_, res) => {
    const golongan = await golonganRepository.find();

    return res.json(golongan);
};

export const createGolongan: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateGolongan(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const newGolongan = golonganRepository.create({
        nama_golongan: req.body.nama_golongan,
    });
    const savedGolongan = await golonganRepository.save(newGolongan);

    return res.json(savedGolongan);
};

export const updateGolongan: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateGolongan(req.body, req.params.id));
    if (validationResult) return handleError("validation", res, validationResult);

    console.log(validationResult);

    const golongan = await golonganRepository.findOne(req.params.id);
    if (!golongan) return handleError("notFound", res);

    await golonganRepository.update(golongan, req.body);

    return res.status(204).json();
};

export const deleteGolongan: Controller = async (req, res) => {
    const golongan = await golonganRepository.findOne(req.params.id);
    if (!golongan) return handleError("notFound", res);

    const deletedGolongan = await golonganRepository.delete(req.params.id);

    return res.json(deletedGolongan);
};
