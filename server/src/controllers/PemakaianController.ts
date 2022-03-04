import { ValidationError } from "fastest-validator";
import { getRepository } from "typeorm";
import type { Controller } from "../../@types/express";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import { handleError, handleValidationError } from "../utils/errorResponse";
import findPrevUsage from "../utils/findPrevUsage";
import findTotal from "../utils/findTotal";
import { validatePemakaian } from "../utils/validation";

const pemakaianRepository = getRepository(PemakaianPelanggan);

export const getPemakaianById: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id, {
        relations: ["pelanggan", "pelanggan.golongan", "pembayaran"],
    });

    if (!pemakaian) return handleError("notFound", res);

    const { tarifPemakaian, totalPemakaian } = await findTotal(
        pemakaian.pelanggan.id_pelanggan,
        pemakaian.meter_awal,
        pemakaian.meter_akhir
    );

    const [lastPemakaian, lastPemakaianCount] = await pemakaianRepository
        .createQueryBuilder("pemakaian")
        .where("pemakaian.pembayaran IS NULL")
        .andWhere("pemakaian.pelanggan = :pelanggan", {
            pelanggan: pemakaian.pelanggan.id_pelanggan,
        })
        .getManyAndCount();

    if (tarifPemakaian) {
        Object.assign(pemakaian, {
            tagihan: {
                total_pemakaian: totalPemakaian,
                total_bayar: tarifPemakaian.tarif * totalPemakaian,
            },
        });

        const usageDate = new Date(pemakaian.tanggal);
        const currDate = new Date();

        const currYear = currDate.getFullYear();
        const currMonth = currDate.getMonth();

        const usageYear = usageDate.getFullYear();
        const usageMonth = usageDate.getMonth();

        // pemakaian bulan januari 1
        // skrg tanggal lebih dari 20

        // cek bulan dan tanggal skrg bandingkan

        // denda
        if (
            (!pemakaian.pembayaran && currDate.getDate() >= 20 && usageDate.getDate() < 20) || // handle ketika pemakaian diinput lebih dari tanggal 20
            (!pemakaian.pembayaran && usageYear <= currYear && usageMonth < currMonth) ||
            (lastPemakaianCount > 1 &&
                lastPemakaian.at(-1)?.id_pemakaian !== pemakaian.id_pemakaian) // handle denda bukan untuk pemakaian paling terbaru
        ) {
            pemakaian.denda = tarifPemakaian.tarif * totalPemakaian * 0.1;
            await pemakaianRepository.save(pemakaian);
        }
    }

    return res.json(pemakaian);
};

export const getPemakaian: Controller = async (req, res) => {
    const { sudah_dibayar, id_pelanggan } = req.query;

    const take = Number(req.query.take) || 25;
    const skip = Number(req.query.skip) || 0;

    let pemakaian: any = pemakaianRepository
        .createQueryBuilder("pemakaian")
        .orderBy("pemakaian.id_pemakaian", "ASC")
        .take(take)
        .skip(skip)
        .innerJoinAndSelect("pemakaian.pelanggan", "pelanggan")
        .leftJoinAndSelect("pemakaian.pembayaran", "pembayaran");

    if (id_pelanggan) {
        pemakaian = pemakaian.andWhere("pemakaian.pelanggan = :pelanggan", {
            pelanggan: id_pelanggan,
        });
    }

    if (sudah_dibayar === "1") {
        pemakaian = pemakaian.andWhere("pemakaian.pembayaran IS NOT NULL");
    } else if (sudah_dibayar === "0") {
        pemakaian = pemakaian.andWhere("pemakaian.pembayaran IS NULL");
    }

    if (req.query.periode) {
        const [year, month] = (req.query.periode as string).split("-");
        pemakaian = pemakaian.andWhere(
            "MONTH(pemakaian.tanggal) = :month AND YEAR(pemakaian.tanggal) = :year",
            { month, year }
        );
    }

    pemakaian = await pemakaian.getMany();

    pemakaian = await Promise.all(
        pemakaian.map(async (eachPemakaian: PemakaianPelanggan) => {
            const { tarifPemakaian, totalPemakaian } = await findTotal(
                eachPemakaian.pelanggan.id_pelanggan,
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

    return res.json({ result: pemakaian, count: pemakaian.length });
};

export const createPemakaian: Controller = async (req, res) => {
    const validationResult = handleValidationError(await validatePemakaian(req.body));
    if (validationResult) return handleError("validation", res, validationResult);

    const meter_akhir = Number(req.body.meter_akhir);

    const meter_awal = await findPrevUsage(req.body.pelanggan);
    if (meter_akhir < meter_awal) {
        return res.status(400).json([
            {
                type: "invalid",
                field: "meter_akhir",
                message: "Meter akhir kurang dari meter awal",
            } as ValidationError,
        ]);
    }

    try {
        const { tarifPemakaian } = await findTotal(req.body.pelanggan, meter_awal, meter_akhir);

        if (!tarifPemakaian) {
            return res.status(400).json([
                {
                    type: "invalid",
                    field: "pelanggan",
                    message: "Golongan tidak punya tarif",
                } as ValidationError,
            ]);
        }

        const newPemakaian = pemakaianRepository.create({
            pelanggan: req.body.pelanggan,
            meter_awal,
            meter_akhir: req.body.meter_akhir,
            tanggal: new Date(),
        });

        const savedPemakaian = await pemakaianRepository.save(newPemakaian);

        return res.json(savedPemakaian);
    } catch (err) {
        return res.status(400).json([
            {
                type: "invalid",
                field: "meter_akhir",
                message: "Tidak ada tarif pemakaian untuk golongan",
            },
        ]);
    }
};

export const updatePemakaian: Controller = async (req, res) => {
    const validationResult = handleValidationError(
        await validatePemakaian(req.body, req.params.id)
    );
    if (validationResult) return handleError("validation", res, validationResult);

    const meter_akhir = Number(req.body.meter_akhir);

    const pemakaian = await pemakaianRepository.findOne(req.params.id);
    if (!pemakaian) return handleError("notFound", res);

    if (meter_akhir < pemakaian.meter_awal) {
        return res.status(400).json([
            {
                type: "invalid",
                field: "meter_akhir",
                message: "Meter akhir kurang dari meter awal",
            } as ValidationError,
        ]);
    }

    await pemakaianRepository.update(pemakaian, {
        meter_akhir: req.body.meter_akhir,
        tanggal: new Date(),
    });

    return res.status(204).json();
};

export const deletePemakaian: Controller = async (req, res) => {
    const pemakaian = await pemakaianRepository.findOne(req.params.id);

    if (!pemakaian) return handleError("notFound", res);

    const deletedPemakaian = await pemakaianRepository.delete(req.params.id);

    return res.json(deletedPemakaian);
};

export const getPeriodePemakaian: Controller = async (_, res) => {
    const periode = await pemakaianRepository
        .createQueryBuilder("pemakaian")
        .select("DISTINCT YEAR(tanggal) AS year, MONTH(tanggal) AS month")
        .getRawMany();

    res.json(periode);
};
