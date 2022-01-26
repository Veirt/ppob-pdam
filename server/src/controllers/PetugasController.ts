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
