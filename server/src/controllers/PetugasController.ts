import * as argon2 from "argon2";
import { getRepository, ILike } from "typeorm";
import type { Controller } from "../../@types/express";
import Petugas from "../entities/Petugas";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validatePetugas } from "../utils/validation";

const petugasRepository = getRepository(Petugas);

export const getPetugasById: Controller = async (req, res) => {
    const petugas = await petugasRepository.findOne(req.params.id, {
        relations: ["role"],
    });

    return res.json(petugas);
};

export const getPetugas: Controller = async (req, res) => {
    const { search } = req.query;

    const petugas = await petugasRepository.find({
        relations: ["role"],
        where: { nama: ILike(`%${search}%`) },
    });

    return res.json(petugas);
};

export const createPetugas: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePetugas(req.body)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const newPetugas = petugasRepository.create({
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
    });

    const savedPetugas = await petugasRepository.save(newPetugas);

    return res.json({
        nama: savedPetugas.nama,
        username: savedPetugas.username,
        role: savedPetugas.role,
    });
};

export const updatePetugas: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePetugas(req.body, req.params.id)
    );
    if (validationResult)
        return handleError("validation", res, validationResult);

    const petugas = await petugasRepository.findOne(req.params.id, {
        relations: ["role"],
    });
    if (!petugas) return handleError("notFound", res);

    // encrypt password
    if (req.body.password) {
        req.body.password = await argon2.hash(req.body.password);
    }

    await petugasRepository.save({
        ...petugas,
        ...req.body,
    });

    return res.status(204).json();
};

export const deletePetugas: Controller = async (req, res) => {
    const petugas = await petugasRepository.findOne(req.params.id, {
        relations: ["role"],
    });

    if (!petugas) return handleError("notFound", res);

    const deletedPetugas = await petugasRepository.delete(req.params.id);

    return res.json(deletedPetugas);
};
