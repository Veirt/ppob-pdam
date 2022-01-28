import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Pelanggan from "./Pelanggan";
import TagihanPelanggan from "./TagihanPelanggan";

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

    @OneToOne(() => TagihanPelanggan, { cascade: true })
    @JoinColumn({ name: "tagihan" })
    tagihan!: TagihanPelanggan;
}

export default PemakaianPelanggan;
