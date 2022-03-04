import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import PemakaianPelanggan from "./PemakaianPelanggan";
import Petugas from "./Petugas";

@Entity({ name: "pembayaran_pelanggan" })
class PembayaranPelanggan {
    @PrimaryGeneratedColumn()
    id_pembayaran!: number;

    @Column({ type: "datetime" })
    tanggal_bayar!: Date;

    @Column({ type: "int" })
    biaya_admin!: number;

    @ManyToOne(() => Petugas, (petugas) => petugas.pembayaran, {
        nullable: true,
    })
    @JoinColumn({ name: "petugas" })
    petugas!: Petugas;

    @OneToOne(() => PemakaianPelanggan, (pemakaian) => pemakaian.pembayaran)
    pemakaian!: PemakaianPelanggan;
}

export default PembayaranPelanggan;
