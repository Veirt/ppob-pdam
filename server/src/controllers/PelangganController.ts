import { getRepository, ILike } from "typeorm";
import type { Controller } from "../../@types/express";
import Pelanggan from "../entities/Pelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import findTotal from "../utils/findTotal";
import { validatePelanggan } from "../utils/validation";

const pelangganRepository = getRepository(Pelanggan);

export const getPelangganById: Controller = async (req, res) => {
    const pelanggan = await pelangganRepository.findOne(req.params.id, {
        relations: ["golongan", "pemakaian", "pemakaian.pembayaran"],
    });

    if (!pelanggan) return handleError("notFound", res);

    pelanggan.pemakaian = await Promise.all(
        pelanggan?.pemakaian.map(async (eachPemakaian) => {
            const { tarifPemakaian, totalPemakaian } = await findTotal(
                pelanggan.id_pelanggan,
                eachPemakaian.meter_awal,
                eachPemakaian.meter_akhir
            );

            if (tarifPemakaian) {
                Object.assign(eachPemakaian, {
                    tagihan: {
                        total_pemakaian: totalPemakaian,
                        total_bayar: tarifPemakaian.tarif * totalPemakaian,
                    },
                });
            }

            return eachPemakaian;
        })
    );

    return res.json(pelanggan);
};

export const getPelanggan: Controller = async (req, res) => {
    const { search, sudah_dicatat } = req.query;

    const take = Number(req.query.take) || 25;
    const skip = Number(req.query.skip) || 0;

    let pelanggan = await pelangganRepository.find({
        take,
        skip,
        relations: ["golongan", "pemakaian"],
        where: [
            {
                nama: ILike(`%${search ?? ""}%`),
            },
            {
                id_pelanggan: ILike(`%${search ?? ""}%`),
            },
        ],
        order: { id_pelanggan: "ASC" },
    });

    pelanggan = pelanggan.map((eachPelanggan) => {
        if (eachPelanggan.pemakaian.length) {
            const lastUsageDate = new Date(eachPelanggan.pemakaian.at(-1)!.tanggal);
            const currentDate = new Date();

            if (
                lastUsageDate.getMonth() === currentDate.getMonth() &&
                lastUsageDate.getFullYear() === currentDate.getFullYear()
            ) {
                Object.assign(eachPelanggan, { sudah_dicatat: true });
            }
        }

        return eachPelanggan;
    });

    if (sudah_dicatat == "1") {
        pelanggan = pelanggan.filter((p) => {
            if (p.sudah_dicatat) {
                return p;
            }
        });
    } else if (sudah_dicatat == "0") {
        pelanggan = pelanggan.filter((p) => {
            if (!p.sudah_dicatat) {
                return p;
            }
        });
    }

    return res.json({ result: pelanggan, count: pelanggan.length });
};

export const createPelanggan: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validatePelanggan(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    // random 10 digits
    let exist: unknown;
    do {
        var id_pelanggan = Math.floor(Math.random() * 9000000000) + 1000000000;
        exist = await pelangganRepository.findOne({
            cache: true,
            select: ["id_pelanggan"],
            where: { id_pelanggan },
        });
    } while (exist);

    const newPelanggan = pelangganRepository.create({
        id_pelanggan,
        nama: req.body.nama,
        alamat: req.body.alamat,
        golongan: req.body.golongan,
    });
    const savedPelanggan = await pelangganRepository.save(newPelanggan);

    return res.json(savedPelanggan);
};

export const updatePelanggan: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validatePelanggan(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const pelanggan = await pelangganRepository.findOne(req.params.id, {
        relations: ["golongan"],
    });
    if (!pelanggan) return handleError("notFound", res);

    await pelangganRepository.update(pelanggan, {
        nama: req.body.nama,
        alamat: req.body.alamat,
        golongan: req.body.golongan.id_golongan,
    });

    return res.status(204).json();
};

export const deletePelanggan: Controller = async (req, res) => {
    const pelanggan = await pelangganRepository.findOne(req.params.id);
    if (!pelanggan) return handleError("notFound", res);

    const deletedPelanggan = await pelangganRepository.delete(req.params.id);

    return res.json(deletedPelanggan);
};
