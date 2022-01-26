import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import GolonganPelanggan from "./GolonganPelanggan";

@Entity()
class Pelanggan {
    @PrimaryGeneratedColumn()
    id_pelanggan!: number;

    @Column({ type: "varchar", length: 255 })
    nama!: string;

    @Column({ type: "text" })
    alamat!: string;

    @ManyToOne(() => GolonganPelanggan, (golongan) => golongan.pelanggan)
    @JoinColumn({ name: "golongan" })
    golongan!: GolonganPelanggan;
}
export default Pelanggan;
