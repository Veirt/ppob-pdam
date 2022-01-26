import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Pelanggan from "./Pelanggan";

// Tiap pelanggan punya banyak tarif pemakaian
// Terhubung di tabel ini.
// ada FK Pelanggan
@Entity({ name: "pemakaian_pelanggan" })
class PemakaianPelanggan {
    @PrimaryGeneratedColumn()
    id_pemakaian!: number;

    @ManyToOne(() => Pelanggan, (pelanggan) => pelanggan.pemakaian)
    @JoinColumn({ name: "pelanggan" })
    pelanggan!: Pelanggan;

    @Column({ type: "int" })
    meter_awal!: number;

    @Column({ type: "int" })
    meter_akhir!: number;

    @Column({ type: "date" })
    tanggal!: Date;

    @Column({ type: "tinyint" })
    sudah_dibayar!: number;
}

export default PemakaianPelanggan;
