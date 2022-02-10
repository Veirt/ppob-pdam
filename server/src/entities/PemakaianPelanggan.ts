import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Pelanggan from "./Pelanggan";
import PembayaranPelanggan from "./PembayaranPelanggan";

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

    @OneToOne(() => PembayaranPelanggan, (pembayaran) => pembayaran.pemakaian, {
        cascade: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "pembayaran" })
    pembayaran?: PembayaranPelanggan;

    @Column({ type: "int", nullable: true })
    denda?: number;
}

export default PemakaianPelanggan;
