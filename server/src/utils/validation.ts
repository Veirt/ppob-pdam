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

const v = new Validator();

export const validatePetugas = async (body: any, id?: string) => {
    const petugasSchema = {
        nama: { type: "string", max: 255 },
        username: {
            type: "string",
            min: 3,
            max: 30,
        },
        password: { type: "string", min: 5, optional: true },
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
        kubik_awal: { type: "string", numeric: true },
        kubik_akhir: { type: "string", numeric: true },
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
        pelanggan: { type: "number" },
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
        biaya_admin: { type: "string", numeric: true },
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
