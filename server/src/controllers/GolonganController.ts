import { getRepository, ILike } from "typeorm";
import type { Controller } from "../../@types/express";
import Golongan from "../entities/GolonganPelanggan";
import TarifPemakaian from "../entities/TarifPemakaian";
import { handleError, handleValidationError } from "../utils/errorResponse";
import { validateGolongan } from "../utils/validation";

const golonganRepository = getRepository(Golongan);
const tarifRepository = getRepository(TarifPemakaian);

export const getGolonganById: Controller = async (req, res) => {
    const golongan = await golonganRepository.findOne(req.params.id, { relations: ["tarif"] });

    //@ts-ignore
    if (golongan) golongan.tarif.sort((a, b) => parseFloat(a.tarif) - parseFloat(b.tarif));

    return res.json(golongan);
};

export const getGolongan: Controller = async (req, res) => {
    const { search } = req.query;

    const take = Number(req.query.take) || 25;
    const skip = Number(req.query.skip) || 0;

    const [result, count] = await golonganRepository.findAndCount({
        take,
        skip,
        where: {
            nama_golongan: ILike(`%${search ?? ""}%`),
        },
        order: { id_golongan: "ASC" },
        relations: ["tarif"],
    });

    return res.json({ result, count });
};

export const createGolongan: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateGolongan(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const newGolongan = golonganRepository.create({
        nama_golongan: req.body.nama_golongan,
    });

    const savedGolongan = await golonganRepository.save(newGolongan);

    for await (const t of req.body.tarif) {
        const newTarif = tarifRepository.create({
            golongan: savedGolongan,
            meter_kubik_awal: t.meter_kubik_awal,
            meter_kubik_akhir: t.meter_kubik_akhir,
            tarif: t.tarif,
        });

        await tarifRepository.save(newTarif);
    }

    return res.json(savedGolongan);
};

export const updateGolongan: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validateGolongan(req.body, req.params.id));
    if (validationResult) return handleError("validation", res, validationResult);

    const golongan = await golonganRepository.findOne(req.params.id);
    if (!golongan) return handleError("notFound", res);

    await golonganRepository.update(golongan, { nama_golongan: req.body.nama_golongan });

    const prevTarif = await tarifRepository.find({ where: { golongan: req.params.id } });
    const newTarifList = req.body.tarif.map((t: TarifPemakaian) => t.id_tarif);

    const deletedList = prevTarif.reduce((acc, curr) => {
        if (!newTarifList.includes(curr.id_tarif)) {
            acc.push(curr.id_tarif);
        }

        return acc;
    }, [] as number[]);

    // mass create, update and delete tarif
    for await (const t of req.body.tarif) {
        const tarif = {
            meter_kubik_awal: t.meter_kubik_awal,
            meter_kubik_akhir: t.meter_kubik_akhir,
            tarif: t.tarif,
        };

        if (t.id_tarif) {
            await tarifRepository.update(t.id_tarif, tarif);
        } else {
            await tarifRepository.save({
                ...tarif,
                golongan: { id_golongan: Number(req.params.id) },
            });
        }
    }

    deletedList.forEach(async (dt) => {
        await tarifRepository.delete(dt);
    });

    return res.status(204).json();
};

export const deleteGolongan: Controller = async (req, res) => {
    const golongan = await golonganRepository.findOne(req.params.id);
    if (!golongan) return handleError("notFound", res);

    const deletedGolongan = await golonganRepository.delete(req.params.id);

    return res.json(deletedGolongan);
};
