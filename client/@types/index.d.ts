export interface Golongan {
    id_golongan: number;
    nama_golongan?: string;
}

export interface Customer {
    id_pelanggan: number | string;
    nama: string;
    alamat: string;
    golongan: Golongan;
    pemakaian?: Usage[];
}

export interface Usage {
    id_pemakaian: number;
    meter_awal: number;
    meter_akhir: number;
    tanggal: Date;
    tagihan: Bill;
    denda: number | null;
    pembayaran: Payment | null;
    pelanggan?: {
        id_pelanggan: number | string;
        nama: string;
        alamat: string;
        golongan: Golongan;
    };
}

export interface Bill {
    total_bayar: number;
    total_pemakaian: number;
}

export interface Payment {
    id_pembayaran: number;
    tanggal_bayar: Date;
    biaya_admin: number;
    petugas: Petugas;
}

export interface User {
    id_petugas: number;
    username: string;
    nama: string;
    role: Role;
}

export interface Role {
    id_role: number;
    nama_role: string;
}

export interface Employee extends User {}

export interface ValidationError {
    type: string;
    message: string;
    field: string;
    actual: any;
}

export interface Query {
    search: string;
}
