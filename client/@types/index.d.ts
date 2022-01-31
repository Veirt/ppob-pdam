export interface Customer {
    id_pelanggan: number;
    nama: string;
    alamat: string;
    golongan: {
        id_golongan: number;
        nama_golongan: string;
    };
}
