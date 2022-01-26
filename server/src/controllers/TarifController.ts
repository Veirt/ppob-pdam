import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import TarifPemakaian from "../entities/TarifPemakaian";

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
    // TODO: validate input
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
    // TODO: validate input
    const tarif = await tarifRepository.findOne(req.params.id);

    // TODO: better validation
    if (!tarif) {
        return res.status(404).json();
    }

    await tarifRepository.update(tarif, req.body);

    return res.status(200).json({ msg: "Successfully updated" });
};

export const deleteTarif: Controller = async (req, res) => {
    const tarif = await tarifRepository.findOne(req.params.id);

    // TODO: better validation
    if (!tarif) {
        return res.status(404).json();
    }

    await tarifRepository.delete(req.params.id);
    return res.json({ msg: "Successfully deleted" });
};
