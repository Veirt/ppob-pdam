import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import Golongan from "../entities/GolonganPelanggan";
import { validateGolongan } from "../utils/validation";

const golonganRepository = getRepository(Golongan);

export const getGolonganById: Controller = async (req, res) => {
    const golongan = await golonganRepository.findOne(req.params.id);
    return res.json(golongan);
};

export const getGolongan: Controller = async (_, res) => {
    const golongan = await golonganRepository.find();
    return res.json(golongan);
};

export const createGolongan: Controller = async (req, res) => {
    const validationResult = await validateGolongan(req.body);
    if (validationResult.length > 0) return res.json(validationResult);

    const { nama_golongan } = req.body;

    const newGolongan = golonganRepository.create({ nama_golongan });
    await golonganRepository.save(newGolongan);

    return res.json({ msg: "Success" });
};

export const updateGolongan: Controller = async (req, res) => {
    const validationResult = await validateGolongan(req.body, req.params.id);
    if (validationResult.length > 0) return res.json(validationResult);

    const golongan = await golonganRepository.findOne(req.params.id);

    if (!golongan) {
        return res.status(404).json();
    }

    await golonganRepository.update(golongan, req.body);

    return res.status(200).json({ msg: "Successfully updated" });
};

export const deleteGolongan: Controller = async (req, res) => {
    const golongan = await golonganRepository.findOne(req.params.id);

    if (!golongan) {
        return res.status(404).json();
    }

    await golonganRepository.delete(req.params.id);
    return res.json({ msg: "Successfully deleted" });
};
