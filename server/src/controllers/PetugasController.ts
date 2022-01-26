import * as argon2 from "argon2";
import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import Petugas from "../entities/Petugas";

const petugasRepository = getRepository(Petugas);

export const getPetugasById: Controller = async (req, res) => {
    const petugas = await petugasRepository.findOne(req.params.id, {
        relations: ["role"],
    });
    return res.json(petugas);
};

export const getPetugas: Controller = async (_, res) => {
    const petugas = await petugasRepository.find({ relations: ["role"] });
    return res.json(petugas);
};

export const createPetugas: Controller = async (req, res) => {
    // TODO: validate input
    if (Object.keys(req.body).length < 4) {
        return res.status(400).json({ msg: "Silakan isi form. " });
    }
    const { nama, username, password, role } = req.body;

    const newPetugas = petugasRepository.create({
        nama,
        username,
        password,
        role,
    });
    await petugasRepository.save(newPetugas);

    return res.json({ msg: "Success" });
};

export const updatePetugas: Controller = async (req, res) => {
    // TODO: validate input
    const { nama, username, password, role } = req.body;

    const petugas = await petugasRepository.findOne(req.params.id, {
        relations: ["role"],
    });

    // TODO: better validation
    if (!petugas) {
        return res.status(404).json();
    }

    if (password) {
        await petugasRepository.update(petugas, {
            nama,
            username,
            password: await argon2.hash(password),
            role,
        });
    } else {
        await petugasRepository.update(petugas, { nama, username, role });
    }

    return res.status(200).json({ msg: "Successfully updated" });
};

export const deletePetugas: Controller = async (req, res) => {
    const petugas = await petugasRepository.findOne(req.params.id, {
        relations: ["role"],
    });

    // TODO: better validation
    if (!petugas) {
        return res.status(404).json();
    }

    await petugasRepository.delete(req.params.id);
    return res.json({ msg: "Successfully deleted" });
};
