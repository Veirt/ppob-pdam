import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Pelanggan from "./Pelanggan";

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
}

export default PemakaianPelanggan;
