import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import PemakaianPelanggan from "./PemakaianPelanggan";
import Petugas from "./Petugas";

@Entity({ name: "pembayaran_pelanggan" })
class PembayaranPelanggan {
    @PrimaryGeneratedColumn()
    id_pembayaran!: number;

    @Column({ type: "date" })
    tanggal_bayar!: Date;

    @Column({ type: "int" })
    biaya_admin!: number;

    @OneToOne(() => Petugas)
    @JoinColumn({ name: "petugas" })
    petugas!: Petugas;

    @OneToOne(() => PemakaianPelanggan, (pemakaian) => pemakaian.pembayaran)
    pemakaian!: PemakaianPelanggan;
}

export default PembayaranPelanggan;
