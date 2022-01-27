import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import TagihanPelanggan from "../entities/TagihanPelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
// import { validateTagihan } from "../utils/validation";

const tagihanRepository = getRepository(TagihanPelanggan);

export const getTagihanById: Controller = async (req, res) => {
    const tagihan = await tagihanRepository.findOne(req.params.id, {
        relations: ["pemakaian", "pembayaran"],
    });

    return res.json(tagihan);
};

export const getTagihan: Controller = async (_, res) => {
    const tagihan = await tagihanRepository.find({
        relations: ["pemakaian", "pembayaran"],
    });

    return res.json(tagihan);
};

export const createTagihan: Controller = async (req, res) => {
    const newTagihan = tagihanRepository.create({
        pemakaian: { id_pemakaian: 25 },
        total_bayar: 10000,
        total_pemakaian: 1000,
    });

    const savedTagihan = await tagihanRepository.save(newTagihan);

    return res.json(savedTagihan);
};

export const updateTagihan: Controller = async (req, res) => {
    const tagihan = await tagihanRepository.findOne(req.params.id);
    if (!tagihan) return handleError("notFound", res);

    await tagihanRepository.update(tagihan, req.body);

    return res.status(204).json();
};

export const deleteTagihan: Controller = async (req, res) => {
    const tagihan = await tagihanRepository.findOne(req.params.id);

    if (!tagihan) return handleError("notFound", res);

    const deletedTagihan = await tagihanRepository.delete(req.params.id);

    return res.json(deletedTagihan);
};
