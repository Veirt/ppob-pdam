export interface Golongan {
    id_golongan: number;
    nama_golongan?: string;
}

export interface Customer {
    id_pelanggan: number;
    nama: string;
    alamat: string;
    golongan: Golongan;
}

export interface User {
    id_petugas: number;
    username: string;
    nama: string;
    role: Role;
}

export interface Role {
    id_role: number;
    nama_role?: string;
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
