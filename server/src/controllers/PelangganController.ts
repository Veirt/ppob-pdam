import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import Pelanggan from "../entities/Pelanggan";

const pelangganRepository = getRepository(Pelanggan);

export const getPelangganById: Controller = async (req, res) => {
    const pelanggan = await pelangganRepository.findOne(req.params.id, {
        relations: ["golongan"],
    });
    return res.json(pelanggan);
};

export const getPelanggan: Controller = async (_, res) => {
    const pelanggan = await pelangganRepository.find({
        relations: ["golongan"],
    });
    return res.json(pelanggan);
};

export const createPelanggan: Controller = async (req, res) => {
    // TODO: validate input
    if (Object.keys(req.body).length < 3) {
        return res.status(400).json({ msg: "Silakan isi form. " });
    }
    const { nama, alamat, golongan } = req.body;

    const newPelanggan = pelangganRepository.create({ nama, alamat, golongan });
    await pelangganRepository.save(newPelanggan);

    return res.json({ msg: "Success" });
};

export const updatePelanggan: Controller = async (req, res) => {
    // TODO: validate input
    const pelanggan = await pelangganRepository.findOne(req.params.id, {
        relations: ["golongan"],
    });

    // TODO: better validation
    if (!pelanggan) {
        return res.status(404).json();
    }

    await pelangganRepository.update(pelanggan, req.body);

    return res.status(200).json({ msg: "Successfully updated" });
};

export const deletePelanggan: Controller = async (req, res) => {
    const pelanggan = await pelangganRepository.findOne(req.params.id);
    console.log(pelanggan);

    // TODO: better validation
    if (!pelanggan) {
        return res.status(404).json();
    }

    await pelangganRepository.delete(req.params.id);
    return res.json({ msg: "Successfully deleted" });
};
