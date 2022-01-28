import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Pelanggan from "./Pelanggan";

@Entity({ name: "denda_pelanggan" })
class Denda {
    @PrimaryGeneratedColumn()
    id_denda!: number;

    @ManyToOne(() => Pelanggan, (pelanggan) => pelanggan.denda)
    @JoinColumn({ name: "pelanggan" })
    pelanggan!: Pelanggan;

    @Column({ type: "int" })
    total_denda!: number;

    @Column({ type: "tinyint" })
    sudah_dibayar!: 0 | 1;
}

export default Denda;
