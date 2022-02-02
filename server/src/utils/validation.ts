import Validator from "fastest-validator";
import { getRepository } from "typeorm";
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

const v = new Validator();

const petugasSchema = {
    nama: { type: "string", max: 255 },
    username: {
        type: "string",
        min: 3,
        max: 30,
    },
    password: { type: "string", min: 5, optional: true },
    role: { type: "string", numeric: true },
};

export const validatePetugas = async (body: any, id?: string) => {
    let result = v.compile(petugasSchema)(body);
    if (result === true) {
        result = [];
    }

    const petugas = await petugasRepository.findOne({
        username: body.username,
    });

    // second condition
    // prevent error when username is still the same
    if (petugas && Number(id) !== petugas.id_petugas) {
        (result as Array<any>).push({
            type: "unique",
            message: "Username already exists.",
            field: "username",
            actual: body.username,
        });
    }

    const role = await roleRepository.findOne({ id_role: body.role });
    if (!role) {
        (result as Array<any>).push({
            type: "invalid",
            message: "Role doesn't exist",
            field: "role",
            actual: body.role,
        });
    }

    return result as Array<any>;
};

const pelangganSchema = {
    nama: { type: "string", max: 255 },
    alamat: {
        type: "string",
    },
    golongan: { type: "string", numeric: true },
};

export const validatePelanggan = async (body: any) => {
    let result = v.compile(pelangganSchema)(body);
    if (result === true) {
        result = [];
    }

    const golongan = await golonganRepository.findOne({
        id_golongan: body.golongan,
    });
    if (!golongan) {
        (result as Array<any>).push({
            type: "invalid",
            message: "Golongan doesn't exist",
            field: "golongan",
            actual: body.golongan,
        });
    }

    return result as Array<any>;
};

const tarifSchema = {
    kubik_awal: { type: "string", numeric: true },
    kubik_akhir: { type: "string", numeric: true },
    tarif: { type: "string", numeric: true },
    golongan: { type: "string", numeric: true },
};

export const validateTarif = async (body: any) => {
    let result = v.compile(tarifSchema)(body);
    if (result === true) {
        result = [];
    }

    const golongan = await golonganRepository.findOne({
        id_golongan: body.golongan,
    });
    if (!golongan) {
        (result as Array<any>).push({
            type: "invalid",
            message: "Golongan doesn't exist",
            field: "golongan",
            actual: body.golongan,
        });
    }

    return result as Array<any>;
};

const pemakaianSchema = {
    pelanggan: { type: "string", numeric: true },
    meter_awal: { type: "string", numeric: true, optional: true },
    meter_akhir: { type: "string", numeric: true },
};

export const validatePemakaian = async (body: any) => {
    let result = v.compile(pemakaianSchema)(body);
    if (result === true) {
        result = [];
    }

    const pelanggan = await pelangganRepository.findOne({
        id_pelanggan: body.pelanggan,
    });
    if (!pelanggan) {
        (result as Array<any>).push({
            type: "invalid",
            message: "Pelanggan doesn't exist",
            field: "pelanggan",
            actual: body.pelanggan,
        });
    }

    const pemakaian = await pemakaianRepository
        .createQueryBuilder()
        .where("pelanggan = :pelanggan")
        .andWhere("MONTH(tanggal) = MONTH(CURRENT_DATE())")
        .andWhere("YEAR(tanggal) = YEAR(CURRENT_DATE())")
        .setParameters({
            pelanggan: pelanggan?.id_pelanggan,
        })
        .getOne();

    if (pemakaian) {
        (result as Array<any>).push({
            type: "invalid",
            message: "Pelanggan sudah punya pemakaian bulan ini.",
            field: "pelanggan",
            actual: body.pelanggan,
        });
    }

    return result as Array<any>;
};

const golonganSchema = {
    nama_golongan: { type: "string", max: 255 },
};

export const validateGolongan = async (body: any, id?: string) => {
    let result = v.compile(golonganSchema)(body);
    if (result === true) {
        result = [];
    }

    const golongan = await golonganRepository.findOne({
        nama_golongan: body.nama_golongan,
    });

    if (golongan && Number(id) !== golongan.id_golongan) {
        (result as Array<any>).push({
            type: "unique",
            message: "Golongan already exists.",
            field: "golongan",
            actual: body.nama_golongan,
        });
    }

    return result as Array<any>;
};

const roleSchema = {
    nama_role: { type: "string", max: 30 },
};

export const validateRole = async (body: any, id?: string) => {
    let result = v.compile(roleSchema)(body);
    if (result === true) {
        result = [];
    }

    const role = await roleRepository.findOne({
        nama_role: body.nama_role,
    });

    if (role && Number(id) !== role.id_role) {
        (result as Array<any>).push({
            type: "unique",
            message: "Role already exists.",
            field: "role",
            actual: body.nama_role,
        });
    }

    return result as Array<any>;
};

const pembayaranSchema = {
    biaya_admin: { type: "string", numeric: true },
    petugas: { type: "string", numeric: true },
    tagihan: { type: "string", numeric: true },
};

export const validatePembayaran = async (body: any) => {
    let result = v.compile(pembayaranSchema)(body);
    if (result === true) {
        result = [];
    }

    const petugas = await petugasRepository.findOne({
        id_petugas: body.petugas,
    });
    if (!petugas) {
        (result as Array<any>).push({
            type: "invalid",
            message: "Petugas doesn't exist",
            field: "petugas",
            actual: body.role,
        });
    }

    return result as Array<any>;
};
