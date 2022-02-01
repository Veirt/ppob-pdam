export interface Customer {
    id_pelanggan: number;
    nama: string;
    alamat: string;
    golongan: {
        id_golongan: number;
        nama_golongan: string;
    };
}

export interface User {
    id_petugas?: number;
    username?: string;
    role?: {
        id_role: number;
        nama_role: string;
    };
}
