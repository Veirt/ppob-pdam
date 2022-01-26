import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";

const pemakaianRepository = getRepository(PemakaianPelanggan);

export const getPemakaianById: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id, {
        relations: ["pelanggan"],
    });
    return res.json(pemakaian);
};

export const getPemakaian: Controller = async (_, res) => {
    const pemakaian = await pemakaianRepository.find({
        relations: ["pelanggan"],
    });
    return res.json(pemakaian);
};

export const createPemakaian: Controller = async (req, res) => {
    // TODO: validate input
    // TODO: cek tunggakan dan apakah sudah bulan ini

    const { pelanggan, meter_awal, meter_akhir } = req.body;
    const newPemakaian = pemakaianRepository.create({
        pelanggan,
        meter_awal,
        meter_akhir,
        tanggal: new Date(),
        sudah_dibayar: 0,
    });

    const savedPemakaian = await pemakaianRepository.save(newPemakaian);

    return res.json(savedPemakaian);
};

export const updatePemakaian: Controller = async (req, res) => {
    // TODO: validate input
    const pemakaian = await pemakaianRepository.findOne(req.params.id);

    // TODO: better validation
    if (!pemakaian) {
        return res.status(404).json();
    }

    await pemakaianRepository.update(pemakaian, req.body);

    return res.status(200).json({ msg: "Successfully updated" });
};

export const deletePemakaian: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id);

    // TODO: better validation
    if (!pemakaian) {
        return res.status(404).json();
    }

    await pemakaianRepository.delete(req.params.id);
    return res.json({ msg: "Successfully deleted" });
};