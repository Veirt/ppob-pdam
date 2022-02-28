import Validator from "fastest-validator";
import { getRepository, Not, Repository } from "typeorm";
import GolonganPelanggan from "../entities/GolonganPelanggan";
import Pelanggan from "../entities/Pelanggan";
import PemakaianPelanggan from "../entities/PemakaianPelanggan";
import Petugas from "../entities/Petugas";
import RolePetugas from "../entities/RolePetugas";

const petugasRepository = getRepository(Petugas);
const pelangganRepository = getRepository(Pelanggan);
const pemakaianRepository = getRepository(PemakaianPelanggan);
const golonganRepository = getRepository(GolonganPelanggan);
const roleRepository = getRepository(RolePetugas);

const checkIfExist = async <T, U>(repository: Repository<T>, key: keyof T, value: U) => {
    try {
        await repository.findOneOrFail({ [key]: value });
        return true;
    } catch {
        return false;
    }
};

const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: {
        tarifNegatif: "Meter kubik awal harus nomor positif",
    },
});

export const validatePetugas = async (body: any, id?: string) => {
    const petugasSchema = {
        nama: { type: "string", max: 255 },
        username: {
            type: "string",
            optional: true,
        },
        password: { type: "string", optional: true },
        role: {
            type: "object",
            props: {
                id_role: "number",
            },
        },
    };

    let result = await v.compile(petugasSchema)(body);
    if (result === true) {
        result = [];
    }

    const petugas = await petugasRepository.findOne({
        where: { username: body.username, id_petugas: Not(id) },
    });

    if (petugas) {
        result.push({
            type: "unique",
            message: "Username already exists.",
            field: "username",
            actual: body.username,
        });
    }

    const roleExist = await checkIfExist(roleRepository, "id_role", body.role.id_role);
    if (!roleExist) {
        result.push({
            type: "invalid",
            message: "Role doesn't exist",
            field: "role",
            actual: body.role.id_role,
        });
    }

    return result;
};

export const validatePelanggan = async (body: any) => {
    const pelangganSchema = {
        nama: { type: "string", max: 255 },
        alamat: {
            type: "string",
        },
        golongan: {
            type: "object",
            props: {
                id_golongan: "number",
            },
        },
    };

    let result = await v.compile(pelangganSchema)(body);
    if (result === true) {
        result = [];
    }

    const golonganExist = await checkIfExist(
        golonganRepository,
        "id_golongan",
        body.golongan.id_golongan
    );
    if (!golonganExist) {
        result.push({
            type: "invalid",
            message: "Golongan doesn't exist",
            field: "golongan",
            actual: body.golongan.id_golongan,
        });
    }

    return result;
};

export const validateTarif = async (body: any) => {
    const tarifSchema = {
        meter_kubik_awal: { type: "string", numeric: true },
        meter_kubik_akhir: { type: "string", numeric: true },
        tarif: { type: "string", numeric: true },
        golongan: { type: "string", numeric: true },
    };

    let result = await v.compile(tarifSchema)(body);
    if (result === true) {
        result = [];
    }

    const golonganExist = await checkIfExist(
        golonganRepository,
        "id_golongan",
        body.golongan.id_golongan
    );
    if (!golonganExist) {
        result.push({
            type: "invalid",
            message: "Golongan doesn't exist",
            field: "golongan",
            actual: body.golongan,
        });
    }

    return result;
};

export const validatePemakaian = async (body: any, id?: string) => {
    const pemakaianSchema = {
        pelanggan: { type: "string", numeric: true },
    };

    let result = await v.compile(pemakaianSchema)(body);
    if (result === true) {
        result = [];
    }

    const pelanggan = await pelangganRepository.findOne({
        id_pelanggan: body.pelanggan,
    });
    if (!pelanggan) {
        result.push({
            type: "invalid",
            message: "Pelanggan doesn't exist",
            field: "pelanggan",
            actual: body.pelanggan,
        });
    }

    const pemakaian = await pemakaianRepository
        .createQueryBuilder()
        .where("pelanggan = :pelanggan")
        .andWhere("id_pemakaian <> :id_pemakaian")
        .andWhere("MONTH(tanggal) = MONTH(CURRENT_DATE())")
        .andWhere("YEAR(tanggal) = YEAR(CURRENT_DATE())")
        .setParameters({
            pelanggan: pelanggan?.id_pelanggan,
            id_pemakaian: id,
        })
        .getOne();

    if (pemakaian) {
        result.push({
            type: "invalid",
            message: "Pelanggan sudah punya pemakaian bulan ini.",
            field: "pelanggan",
            actual: body.pelanggan,
        });
    }

    return result;
};

export const validateGolongan = async (body: any, id?: string) => {
    const golonganSchema = {
        nama_golongan: { type: "string", max: 255 },
        tarif: {
            type: "array",
            items: {
                type: "object",
                props: {
                    meter_kubik_awal: {
                        type: "custom",
                        check(value: number, err: any) {
                            if (value < 0) {
                                err.push({ type: "tarifNegatif" });
                            }

                            return value;
                        },
                    },
                    meter_kubik_akhir: { type: "number", positive: true, optional: true },
                    tarif: { type: "number", positive: true, convert: true },
                },
            },
        },
    };

    let result = await v.compile(golonganSchema)(body);
    if (result === true) {
        result = [];
    }

    const golongan = await golonganRepository.findOne({
        where: {
            nama_golongan: body.nama_golongan,
            id_golongan: Not(id),
        },
    });

    if (golongan) {
        result.push({
            type: "unique",
            message: "Golongan already exists.",
            field: "golongan",
            actual: body.nama_golongan,
        });
    }

    // could have find a better solution.
    // forgive me, future of me.

    if (body.tarif[0].meter_kubik_awal !== 0) {
        result.push({
            type: "invalid",
            message: "Meter Kubik awal pertama harus 0",
            field: "tarif",
            actual: body.nama_golongan,
        });
    }

    let max = 0;
    body.tarif.forEach(
        (t: { meter_kubik_awal: number; meter_kubik_akhir: number; tarif: number }) => {
            if (max < t.meter_kubik_awal) {
                max = t.meter_kubik_awal;
            }
            if (max < t.meter_kubik_akhir) {
                max = t.meter_kubik_akhir;
            }
        }
    );

    const range: number[] = [];
    for (const t of body.tarif) {
        if (t.meter_kubik_awal > t.meter_kubik_akhir && t.meter_kubik_akhir !== null) {
            result.push({
                type: "invalid",
                message: "Meter kubik tidak valid",
                field: "tarif",
                actual: body.nama_golongan,
            });

            return result;
        }

        if (t.meter_kubik_akhir !== null) {
            for (let i = t.meter_kubik_awal; i <= t.meter_kubik_akhir; i++) {
                range.push(i);
            }
        } else {
            for (let i = t.meter_kubik_awal; i <= max; i++) {
                range.push(i);
            }
        }
    }

    const duplicates = range.filter((i, idx) => range.indexOf(i) !== idx);
    if (duplicates.length) {
        result.push({
            type: "invalid",
            message: "Tarif tidak valid. Ada meter kubik yang tumpang tindih",
            field: "tarif",
            actual: body.nama_golongan,
        });

        return result;
    }

    let curNumber = 0;
    for (const n of range) {
        if (n !== 0) {
            if (curNumber + 1 !== n) {
                result.push({
                    type: "invalid",
                    message: "Meter kubik tidak valid. Ada meter kubik yang tidak terjangkau",
                    field: "tarif",
                    actual: body.nama_golongan,
                });

                return result;
            }
        }

        curNumber = n;
    }

    return result;
};

export const validateRole = async (body: any, id?: string) => {
    const roleSchema = {
        nama_role: { type: "string", max: 30 },
    };

    let result = await v.compile(roleSchema)(body);
    if (result === true) {
        result = [];
    }

    const role = await roleRepository.findOne({
        where: {
            id_role: Not(id),
            nama_role: body.nama_role,
        },
    });

    if (role) {
        result.push({
            type: "unique",
            message: "Role already exists.",
            field: "role",
            actual: body.nama_role,
        });
    }

    return result;
};

export const validatePembayaran = async (body: any) => {
    const pembayaranSchema = {
        petugas: {
            type: "object",
            props: {
                id_petugas: "number",
            },
        },
    };

    let result = await v.compile(pembayaranSchema)(body);
    if (result === true) {
        result = [];
    }

    if (body.pemakaian.pembayaran) {
        result.push({
            type: "invalid",
            message: "Sudah dibayar",
            field: "pembayaran",
            actual: body.pemakaian,
        });
    }

    const petugasExist = await checkIfExist(
        petugasRepository,
        "id_petugas",
        body.petugas.id_petugas
    );

    if (!petugasExist) {
        result.push({
            type: "invalid",
            message: "Petugas doesn't exist",
            field: "petugas",
            actual: body.role,
        });
    }

    return result;
};
